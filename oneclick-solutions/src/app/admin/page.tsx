export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase-admin'
import { Users, Package, TrendingUp, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '관리자 대시보드' }

interface RecentOrder {
  id: string
  order_number: string
  total_krw: number
  service_fee: number
  shipping_fee: number
  status: string
  created_at: string
  profiles: { name: string | null; email: string } | null
}

export default async function AdminDashboardPage() {
  const supabase = createAdminClient()

  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: orderCount } = await supabase
    .from('sourcing_orders')
    .select('*', { count: 'exact', head: true })

  const { count: pendingCount } = await supabase
    .from('sourcing_orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { data: paidOrders } = await supabase
    .from('sourcing_orders')
    .select('total_krw, service_fee, shipping_fee')
    .eq('status', 'paid')

  const totalRevenue = paidOrders?.reduce((sum, o) =>
    sum + o.total_krw + o.service_fee + o.shipping_fee, 0
  ) || 0

  const stats = [
    { label: '총 회원', value: (userCount || 0).toLocaleString() + '명', icon: Users, color: 'text-primary' },
    { label: '전체 소싱 주문', value: (orderCount || 0).toLocaleString() + '건', icon: Package, color: 'text-blue-500' },
    { label: '결제 대기', value: (pendingCount || 0).toLocaleString() + '건', icon: Clock, color: 'text-yellow-500' },
    { label: '총 매출', value: '₩' + totalRevenue.toLocaleString(), icon: TrendingUp, color: 'text-green-500' },
  ]

  const { data: recentOrders } = await supabase
    .from('sourcing_orders')
    .select('*, profiles(name, email)')
    .order('created_at', { ascending: false })
    .limit(5)

  const STATUS_KO: Record<string, string> = {
    pending: '결제 대기',
    paid: '결제 완료',
    purchasing: '구매 진행',
    shipping: '배송 중',
    delivered: '배송 완료',
    cancelled: '취소됨',
  }

  return (
    <div>
      <h1 className="text-[24px] font-extrabold text-text-primary mb-6">딸깍소싱 대시보드</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-text-tertiary mb-1">{stat.label}</p>
                <p className={`text-[22px] font-extrabold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                <stat.icon size={20} className="text-text-tertiary" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 최근 소싱 주문 */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-[16px] font-bold text-text-primary">최근 소싱 주문</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">주문번호</th>
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">고객</th>
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">금액</th>
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">상태</th>
                <th className="text-left px-5 py-3 font-medium text-text-tertiary">날짜</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders && recentOrders.length > 0 ? recentOrders.map((order: RecentOrder) => {
                const total = order.total_krw + order.service_fee + order.shipping_fee
                return (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-mono text-[13px]">{order.order_number}</td>
                    <td className="px-5 py-3 text-text-secondary">
                      {order.profiles?.name || order.profiles?.email || '-'}
                    </td>
                    <td className="px-5 py-3 font-semibold text-primary">₩{total.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className="inline-block px-2 py-0.5 text-[12px] font-semibold rounded-full bg-surface text-text-secondary">
                        {STATUS_KO[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-text-tertiary">
                      {new Date(order.created_at).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-text-tertiary">
                    아직 주문이 없습니다.
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
