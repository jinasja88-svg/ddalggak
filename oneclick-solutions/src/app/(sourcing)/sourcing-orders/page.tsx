import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '소싱 주문 내역',
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: '결제 대기', color: 'bg-yellow-100 text-yellow-700' },
  paid: { label: '결제 완료', color: 'bg-blue-100 text-blue-700' },
  purchasing: { label: '구매 진행', color: 'bg-purple-100 text-purple-700' },
  shipping: { label: '배송 중', color: 'bg-orange-100 text-orange-700' },
  delivered: { label: '배송 완료', color: 'bg-green-100 text-green-700' },
  cancelled: { label: '취소됨', color: 'bg-gray-100 text-gray-500' },
}

export default async function SourcingOrdersPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/sourcing-orders')

  const { data: orders } = await supabase
    .from('sourcing_orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-8">
      <div className="max-w-[900px] mx-auto px-6">
        <h1 className="text-[24px] font-extrabold text-[#1A1A1A] mb-6">소싱 주문 내역</h1>

        {!orders || orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E8ED] p-16 text-center">
            <p className="text-[16px] text-text-secondary mb-2">아직 소싱 주문이 없습니다.</p>
            <p className="text-[14px] text-text-tertiary mb-6">1688 상품을 검색하고 소싱을 시작해보세요!</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-primary text-white text-[14px] font-semibold rounded-xl hover:bg-primary-hover transition-colors"
            >
              소싱하기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = STATUS_LABELS[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-500' }
              const items = order.items as Array<{ title: string; quantity: number; unit_price_krw: number }>
              return (
                <Link
                  key={order.id}
                  href={`/sourcing-orders/${order.id}`}
                  className="block bg-white rounded-2xl border border-[#E8E8ED] p-5 hover:border-primary/20 hover:shadow-[0px_4px_16px_rgba(2,5,211,0.06)] transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[13px] text-text-tertiary">{order.order_number}</p>
                      <p className="text-[14px] text-text-secondary mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  {Array.isArray(items) && items.length > 0 && (
                    <p className="text-[14px] font-medium text-[#1A1A1A] mb-3">
                      {items[0].title}
                      {items.length > 1 && ` 외 ${items.length - 1}건`}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[16px] font-extrabold text-primary">
                      ₩{(order.total_krw + order.service_fee + order.shipping_fee).toLocaleString()}
                    </span>
                    {order.tracking_number && (
                      <span className="text-[12px] text-text-tertiary">
                        운송장: {order.tracking_number}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
