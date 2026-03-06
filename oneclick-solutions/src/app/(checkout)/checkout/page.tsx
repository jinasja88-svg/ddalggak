import { redirect } from 'next/navigation'

// 기존 checkout은 소싱 주문 흐름으로 대체됨
export default function CheckoutPage() {
  redirect('/sourcing-orders')
}
