'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Menu, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'
import MobileMenu from './MobileMenu'

const navLinks = [
  { href: '/shop', label: '소싱하기' },
  { href: '/about', label: '수입대행이란' },
  { href: '/pricing', label: '수수료 안내' },
  { href: '/notices', label: '공지사항' },
]

export default function Header() {
  const pathname = usePathname()
  const [user, setUser] = useState<Profile | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()
        if (profile) setUser(profile)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (profile) setUser(profile)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    window.location.href = '/'
  }

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-[1030]">
        <div className="container-krds">
          <div className="flex items-center justify-between h-[72px]">
            {/* 로고 + 네비게이션 */}
            <div className="flex items-center gap-10">
              <Link
                href="/"
                className="text-[22px] font-extrabold text-primary tracking-tight"
              >
                딸깍소싱
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'text-[15px] font-medium transition-colors duration-200',
                      pathname.startsWith(link.href)
                        ? 'text-primary'
                        : 'text-text-secondary hover:text-primary'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* 우측 액션 */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {/* 사용자 메뉴 */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="p-2.5 rounded-lg hover:bg-surface transition-colors"
                      aria-label="내 계정"
                    >
                      <User size={20} className="text-text-secondary" />
                    </button>

                    {userMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-[1039]"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-lg z-[1040] py-1 animate-fade-in">
                          <div className="px-4 py-3 border-b border-border">
                            <p className="text-[14px] font-semibold text-text-primary truncate">
                              {user.name || user.email}
                            </p>
                            <p className="text-[12px] text-text-tertiary truncate">
                              {user.email}
                            </p>
                          </div>
                          <Link
                            href="/mypage"
                            className="block px-4 py-2.5 text-[14px] text-text-secondary hover:bg-surface transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            마이페이지
                          </Link>
                          <Link
                            href="/sourcing-orders"
                            className="block px-4 py-2.5 text-[14px] text-text-secondary hover:bg-surface transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            소싱 주문 내역
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-2.5 text-[14px] text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                          >
                            <LogOut size={14} />
                            로그아웃
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-[14px] font-medium text-text-secondary hover:text-primary transition-colors"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/login"
                    className="px-5 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-lg hover:bg-primary-hover transition-all shadow-sm hover:shadow-md"
                  >
                    소싱 시작하기
                  </Link>
                </div>
              )}

              {/* 모바일 메뉴 토글 */}
              <button
                className="md:hidden p-2.5 rounded-lg hover:bg-surface transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="메뉴"
              >
                <Menu size={22} className="text-text-primary" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onSignOut={handleSignOut}
      />
    </>
  )
}
