import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Metadata } from 'next'
import type { SourcingOrder, SourcingOrderItem, ShippingAddress } from '@/types'

export const metadata: Metadata = {
  title: '주문 상세',
}

const STATUS_STEPS = [
  { key: 'pending', label: '결제 대기', icon: Clock },
  { key: 'paid', label: '결제 완료', icon: CheckCircle },
  { key: 'purchasing', label: '구매 진행', icon: Package },
  { key: 'shipping', label: '배송 중', icon: Truck },
  { key: 'delivered', label: '배송 완료', icon: CheckCircle },
]

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/sourcing-orders')

  const { data: order } = await supabase
    .from('sourcing_orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (!order) notFound()

  const typedOrder = order as SourcingOrder
  const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === typedOrder.status)
  const items = typedOrder.items as SourcingOrderItem[]
  const address = typedOrder.shipping_address as ShippingAddress | null

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-8">
      <div className="max-w-[800px] mx-auto px-6">
        <Link href="/sourcing-orders" className="inline-flex items-center gap-2 text-[14px] text-text-secondary hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={16} />
          주문 내역으로
        </Link>

        <div className="bg-white rounded-2xl border border-[#E8E8ED] p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[18px] font-bold text-[#1A1A1A]">주문 #{typedOrder.order_number}</h1>
            <span className="text-[13px] text-text-tertiary">
              {new Date(typedOrder.created_at).toLocaleDateString('ko-KR')}
            </span>
          </div>

          {/* 진행 상태 */}
          {typedOrder.status !== 'cancelled' && (
            <div className="flex items-center gap-0 mb-6 overflow-x-auto">
              {STATUS_STEPS.slice(0, -1).map((step, i) => {
                const isCompleted = i <= currentStepIdx
                const Icon = step.icon
                return (
                  <div key={step.key} className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-primary' : 'bg-[#E8E8ED]'}`}>
                        <Icon size={14} className={isCompleted ? 'text-white' : 'text-text-tertiary'} />
                      </div>
                      <span className={`text-[11px] mt-1 whitespace-nowrap ${isCompleted ? 'text-primary font-semibold' : 'text-text-tertiary'}`}>
                        {step.label}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 2 && (
                      <div className={`flex-1 h-0.5 mx-1 ${i < currentStepIdx ? 'bg-primary' : 'bg-[#E8E8ED]'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* 운송장 */}
          {typedOrder.tracking_number && (
            <div className="bg-blue-50 rounded-xl p-3 mb-4">
              <p className="text-[13px] text-blue-700 font-medium">
                운송장 번호: <span className="font-bold">{typedOrder.tracking_number}</span>
              </p>
            </div>
          )}
        </div>

        {/* 주문 아이템 */}
        <div className="bg-white rounded-2xl border border-[#E8E8ED] p-6 mb-4">
          <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-4">주문 상품</h2>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-[#E8E8ED] last:border-0">
                <div className="w-12 h-12 bg-[#EEEFFE] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📦</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[#1A1A1A] truncate">{item.title}</p>
                  {item.sku_label && <p className="text-[12px] text-text-tertiary">{item.sku_label}</p>}
                  <p className="text-[12px] text-text-tertiary">수량: {item.quantity}개</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-semibold text-[#1A1A1A]">₩{(item.unit_price_krw * item.quantity).toLocaleString()}</p>
                  <p className="text-[11px] text-text-tertiary">¥{item.unit_price_cny}/개</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 결제 내역 */}
        <div className="bg-white rounded-2xl border border-[#E8E8ED] p-6 mb-4">
          <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-4">결제 내역</h2>
          <div className="space-y-2 text-[14px]">
            <div className="flex justify-between text-text-secondary">
              <span>상품 금액</span>
              <span>₩{typedOrder.total_krw.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>대행 수수료 (12%)</span>
              <span>₩{typedOrder.service_fee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>국내 배송비</span>
              <span>₩{typedOrder.shipping_fee.toLocaleString()}</span>
            </div>
            <hr className="border-[#E8E8ED]" />
            <div className="flex justify-between font-bold text-[#1A1A1A] text-[15px]">
              <span>합계</span>
              <span className="text-primary">₩{(typedOrder.total_krw + typedOrder.service_fee + typedOrder.shipping_fee).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 배송지 */}
        {address && (
          <div className="bg-white rounded-2xl border border-[#E8E8ED] p-6">
            <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-3">배송지</h2>
            <div className="text-[14px] text-[#525252] space-y-1">
              <p className="font-semibold text-[#1A1A1A]">{address.name}</p>
              <p>{address.phone}</p>
              <p>({address.postal_code}) {address.address}</p>
              {address.address_detail && <p>{address.address_detail}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
