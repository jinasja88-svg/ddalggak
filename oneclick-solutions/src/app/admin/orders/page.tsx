export const dynamic = 'force-dynamic'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { formatPrice, formatDateShort, getOrderStatusLabel } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '주문 관리' }

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  paid: 'success',
  pending: 'warning',
  cancelled: 'error',
  refunded: 'default',
}

export default async function AdminOrdersPage() {
  const supabase = await createServerSupabaseClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, profile:profiles(name, email)')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div>
      <h1 className="text-[24px] font-extrabold text-text-primary mb-6">주문 관리</h1>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">주문번호</th>
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">고객</th>
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">금액</th>
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">상태</th>
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">결제수단</th>
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">주문일</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order: Record<string, unknown>) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                  <td className="px-5 py-3 font-medium text-text-primary">
                    {order.order_number}
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-text-primary">{order.profile?.name || '-'}</p>
                    <p className="text-[12px] text-text-tertiary">{order.profile?.email}</p>
                  </td>
                  <td className="px-5 py-3 font-semibold text-primary">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={statusVariant[order.status] || 'default'}>
                      {getOrderStatusLabel(order.status)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    {order.payment_method || '-'}
                  </td>
                  <td className="px-5 py-3 text-text-tertiary">
                    {formatDateShort(order.created_at)}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-text-tertiary">
                    주문이 없습니다.
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
