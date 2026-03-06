export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Package, User } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '마이페이지' }

const menuItems = [
  { href: '/sourcing-orders', icon: Package, label: '소싱 주문 내역', desc: '수입대행 주문 현황 확인' },
  { href: '/mypage/profile', icon: User, label: '프로필 수정', desc: '개인정보 변경' },
]

export default async function MyPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/mypage')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-8">
      <div className="max-w-[700px] mx-auto px-6">
        <h1 className="text-[24px] font-extrabold text-[#1A1A1A] mb-6">마이페이지</h1>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl border border-[#E8E8ED] p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#EEEFFE] rounded-full flex items-center justify-center">
              <User size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-[18px] font-bold text-[#1A1A1A]">{profile?.name || '사용자'}</p>
              <p className="text-[14px] text-text-secondary">{profile?.email || user.email}</p>
            </div>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl border border-[#E8E8ED] p-5 hover:border-primary/20 hover:shadow-[0px_4px_16px_rgba(2,5,211,0.06)] transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#EEEFFE] rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                  <item.icon size={18} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <p className="text-[15px] font-semibold text-[#1A1A1A]">{item.label}</p>
              </div>
              <p className="text-[13px] text-text-secondary ml-[52px]">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
