import Link from 'next/link'
import { LayoutDashboard, ShoppingCart, Users, Package } from 'lucide-react'

const adminNav = [
  { href: '/admin', icon: LayoutDashboard, label: '대시보드' },
  { href: '/admin/sourcing-orders', icon: Package, label: '소싱 주문 관리' },
  { href: '/admin/orders', icon: ShoppingCart, label: '일반 주문 관리' },
  { href: '/admin/users', icon: Users, label: '회원 관리' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        {/* 사이드바 */}
        <aside className="w-[240px] bg-white border-r border-border min-h-screen fixed top-[72px] left-0 z-10">
          <div className="p-4">
            <h2 className="text-[14px] font-bold text-text-tertiary uppercase tracking-wider px-3 mb-2">
              관리자
            </h2>
            <nav className="space-y-1">
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-text-secondary hover:bg-surface hover:text-primary transition-colors"
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 ml-[240px] p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
