'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

function FailContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const message = searchParams.get('message')

  return (
    <div className="container-krds py-20 text-center">
      <XCircle size={64} className="mx-auto text-error mb-6" />
      <h1 className="text-[28px] font-extrabold text-text-primary mb-2">
        결제에 실패했습니다
      </h1>
      <p className="text-[15px] text-text-secondary mb-2">
        {message || '결제 처리 중 오류가 발생했습니다.'}
      </p>
      {code && (
        <p className="text-[13px] text-text-tertiary mb-8">오류 코드: {code}</p>
      )}
      <div className="flex gap-3 justify-center">
        <Link href="/cart">
          <Button>장바구니로 돌아가기</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">홈으로</Button>
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutFailPage() {
  return (
    <Suspense fallback={<div className="container-krds py-20 text-center"><p className="text-text-secondary">로딩 중...</p></div>}>
      <FailContent />
    </Suspense>
  )
}
