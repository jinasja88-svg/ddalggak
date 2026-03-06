'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  user: Profile | null
  onSignOut: () => void
}

const navLinks = [
  { href: '/shop', label: '소싱하기' },
  { href: '/about', label: '수입대행이란' },
  { href: '/pricing', label: '수수료 안내' },
  { href: '/notices', label: '공지사항' },
]

export default function MobileMenu({ isOpen, onClose, user, onSignOut }: MobileMenuProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[1050] md:hidden">
      {/* 오버레이 */}
      <div className="fixed inset-0 bg-black/40 animate-fade-in" onClick={onClose} />

      {/* 메뉴 패널 */}
      <div className="fixed top-0 right-0 bottom-0 w-[280px] bg-white animate-slide-in-right shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-[18px] font-bold text-primary">딸깍소싱</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface transition-colors"
            aria-label="닫기"
          >
            <X size={22} />
          </button>
        </div>

        {/* 사용자 정보 */}
        {user ? (
          <div className="p-4 border-b border-border bg-surface">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-bg rounded-full flex items-center justify-center">
                <User size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-text-primary">
                  {user.name || '사용자'}
                </p>
                <p className="text-[12px] text-text-tertiary">{user.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-border space-y-2">
            <Link
              href="/login"
              className="block w-full py-2.5 text-center text-[14px] font-semibold text-primary border border-primary rounded-lg"
              onClick={onClose}
            >
              로그인
            </Link>
          </div>
        )}

        {/* 네비게이션 링크 */}
        <nav className="p-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                'block px-4 py-3 rounded-lg text-[15px] font-medium transition-colors',
                pathname.startsWith(link.href)
                  ? 'bg-primary-bg text-primary'
                  : 'text-text-secondary hover:bg-surface'
              )}
            >
              {link.label}
            </Link>
          ))}

          {user && (
            <>
              <hr className="my-2 border-border" />
              <Link
                href="/mypage"
                onClick={onClose}
                className="block px-4 py-3 rounded-lg text-[15px] font-medium text-text-secondary hover:bg-surface transition-colors"
              >
                마이페이지
              </Link>
              <Link
                href="/sourcing-orders"
                onClick={onClose}
                className="block px-4 py-3 rounded-lg text-[15px] font-medium text-text-secondary hover:bg-surface transition-colors"
              >
                소싱 주문 내역
              </Link>
              <button
                onClick={() => {
                  onSignOut()
                  onClose()
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-[15px] font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                로그아웃
              </button>
            </>
          )}
        </nav>
      </div>
    </div>
  )
}
