import { createAdminClient } from '@/lib/supabase-admin'
import type { Metadata } from 'next'
import type { SourcingOrder, SourcingOrderStatus } from '@/types'
import AdminOrderActions from './AdminOrderActions'

export const metadata: Metadata = {
  title: '소싱 주문 관리',
}

const STATUS_LABELS: Record<SourcingOrderStatus, string> = {
  pending: '결제 대기',
  paid: '결제 완료',
  purchasing: '구매 진행',
  shipping: '배송 중',
  delivered: '배송 완료',
  cancelled: '취소됨',
}

const STATUS_COLORS: Record<SourcingOrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  purchasing: 'bg-purple-100 text-purple-700',
  shipping: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

export default async function AdminSourcingOrdersPage() {
  const supabase = createAdminClient()

  const { data: orders } = await supabase
    .from('sourcing_orders')
    .select('*, profiles(email, name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[24px] font-extrabold text-[#1A1A1A]">소싱 주문 관리</h1>
        <p className="text-[14px] text-text-secondary mt-1">1688 수입대행 주문 목록</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E8ED] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead className="bg-[#F8F9FC] border-b border-[#E8E8ED]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary">주문번호</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary">고객</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary">상태</th>
                <th className="text-right px-4 py-3 font-semibold text-text-secondary">결제금액</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary">운송장</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary">주문일</th>
                <th className="text-center px-4 py-3 font-semibold text-text-secondary">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8ED]">
              {!orders || orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-text-secondary">
                    소싱 주문이 없습니다.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const typedOrder = order as SourcingOrder & { profiles: { email: string; name: string | null } | null }
                  const totalAmount = typedOrder.total_krw + typedOrder.service_fee + typedOrder.shipping_fee
                  const statusColor = STATUS_COLORS[typedOrder.status] || 'bg-gray-100 text-gray-500'
                  const statusLabel = STATUS_LABELS[typedOrder.status] || typedOrder.status

                  return (
                    <tr key={typedOrder.id} className="hover:bg-[#F8F9FC] transition-colors">
                      <td className="px-4 py-3 font-mono text-[13px]">{typedOrder.order_number}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{typedOrder.profiles?.name || '-'}</p>
                        <p className="text-[12px] text-text-tertiary">{typedOrder.profiles?.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[12px] font-semibold ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ₩{totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-tertiary">
                        {typedOrder.tracking_number || '-'}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {new Date(typedOrder.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <AdminOrderActions orderId={typedOrder.id} currentStatus={typedOrder.status} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
