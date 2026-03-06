export const dynamic = 'force-dynamic'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { formatDateShort, getPlanLabel } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '회원 관리' }

export default async function AdminUsersPage() {
  const supabase = await createServerSupabaseClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div>
      <h1 className="text-[24px] font-extrabold text-text-primary mb-6">회원 관리</h1>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">이름</th>
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">이메일</th>
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">전화번호</th>
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">구독</th>
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">가입일</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                  <td className="px-5 py-3 font-medium text-text-primary">
                    {user.name || '-'}
                  </td>
                  <td className="px-5 py-3 text-text-secondary">{user.email}</td>
                  <td className="px-5 py-3 text-text-secondary">{user.phone || '-'}</td>
                  <td className="px-5 py-3">
                    <Badge variant={user.subscription_plan === 'pro' ? 'primary' : user.subscription_plan === 'basic' ? 'info' : 'default'}>
                      {getPlanLabel(user.subscription_plan)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-text-tertiary">
                    {formatDateShort(user.created_at)}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-text-tertiary">
                    등록된 회원이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
