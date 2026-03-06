import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const { paymentKey, orderId, amount } = await request.json()

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.json({ error: '필수 파라미터가 누락되었습니다.' }, { status: 400 })
  }

  // Toss Payments 결제 승인 API 호출
  const secretKey = process.env.TOSS_SECRET_KEY!
  const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64')

  const tossResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encryptedSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  })

  const tossData = await tossResponse.json()

  if (!tossResponse.ok) {
    return NextResponse.json(
      { error: tossData.message || '결제 승인에 실패했습니다.' },
      { status: 400 }
    )
  }

  // Supabase 주문 상태 업데이트
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      payment_key: paymentKey,
      payment_method: tossData.method,
      paid_at: tossData.approvedAt,
    })
    .eq('order_number', orderId)

  if (error) {
    console.error('주문 업데이트 실패:', error)
    return NextResponse.json({ error: '주문 상태 업데이트에 실패했습니다.' }, { status: 500 })
  }

  // 장바구니 비우기
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('cart_items').delete().eq('user_id', user.id)
  }

  return NextResponse.json({ data: tossData })
}
