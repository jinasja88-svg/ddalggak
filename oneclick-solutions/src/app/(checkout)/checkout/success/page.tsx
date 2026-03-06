'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

function SuccessContent() {
  const searchParams = useSearchParams()
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const paymentKey = searchParams.get('paymentKey')
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) return

    const confirm = async () => {
      try {
        const res = await fetch('/api/checkout/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          setError(data.error || '결제 승인에 실패했습니다.')
          return
        }

        setConfirmed(true)
      } catch {
        setError('결제 승인 중 오류가 발생했습니다.')
      }
    }

    confirm()
  }, [paymentKey, orderId, amount])

  if (error) {
    return (
      <div className="container-krds py-20 text-center">
        <div className="w-16 h-16 bg-error-bg rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-[32px]">!</span>
        </div>
        <h1 className="text-[24px] font-extrabold text-text-primary mb-2">
          결제 승인 실패
        </h1>
        <p className="text-[15px] text-text-secondary mb-8">{error}</p>
        <Link href="/cart">
          <Button>장바구니로 돌아가기</Button>
        </Link>
      </div>
    )
  }

  if (!confirmed) {
    return (
      <div className="container-krds py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-[15px] text-text-secondary">결제를 확인하고 있습니다...</p>
      </div>
    )
  }

  return (
    <div className="container-krds py-20 text-center">
      <CheckCircle size={64} className="mx-auto text-success mb-6" />
      <h1 className="text-[28px] font-extrabold text-text-primary mb-2">
        결제가 완료되었습니다!
      </h1>
      <p className="text-[15px] text-text-secondary mb-2">
        주문번호: {orderId}
      </p>
      <p className="text-[14px] text-text-tertiary mb-8">
        주문 내역은 마이페이지에서 확인할 수 있습니다.
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/mypage/orders">
          <Button>주문 내역 확인</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">홈으로</Button>
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container-krds py-20 text-center"><div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" /><p className="text-text-secondary">로딩 중...</p></div>}>
      <SuccessContent />
    </Suspense>
  )
}
