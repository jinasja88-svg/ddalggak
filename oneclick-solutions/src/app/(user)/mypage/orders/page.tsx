export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { formatPrice, formatDateShort, getOrderStatusLabel } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Breadcrumb from '@/components/ui/Breadcrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '주문 내역' }

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  paid: 'success',
  pending: 'warning',
  cancelled: 'error',
  refunded: 'default',
}

export default async function OrdersPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/mypage/orders')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(title, slug, type, thumbnail_url))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container-krds py-8">
      <Breadcrumb items={[{ label: '마이페이지', href: '/mypage' }, { label: '주문 내역' }]} />

      <h1 className="text-[24px] font-extrabold text-text-primary mt-6 mb-8">
        주문 내역
      </h1>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[17px] text-text-tertiary mb-6">주문 내역이 없습니다.</p>
          <Link
            href="/courses"
            className="text-[14px] text-primary font-semibold hover:underline"
          >
            강의 둘러보기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-border rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3 bg-surface border-b border-border">
                <div className="flex items-center gap-4 text-[13px]">
                  <span className="text-text-tertiary">
                    {formatDateShort(order.created_at)}
                  </span>
                  <span className="text-text-secondary font-medium">
                    {order.order_number}
                  </span>
                </div>
                <Badge variant={statusVariant[order.status] || 'default'}>
                  {getOrderStatusLabel(order.status)}
                </Badge>
              </div>

              <div className="p-5">
                {order.items?.map((item: Record<string, unknown>) => (
                  <div key={item.id} className="flex items-center gap-4 py-2">
                    <div className="w-12 h-12 bg-surface rounded-lg shrink-0" />
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-text-primary">
                        {item.product?.title || '상품'}
                      </p>
                    </div>
                    <p className="text-[14px] font-bold text-primary">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-end pt-3 mt-3 border-t border-border">
                  <p className="text-[15px]">
                    <span className="text-text-secondary">합계: </span>
                    <span className="font-extrabold text-primary">
                      {formatPrice(order.total_amount)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
