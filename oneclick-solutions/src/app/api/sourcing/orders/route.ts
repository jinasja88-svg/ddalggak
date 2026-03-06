import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const { data: orders, error } = await supabase
    .from('sourcing_orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: orders })
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const body = await request.json()
  const { items, shipping_address } = body

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: '주문 상품이 없습니다.' }, { status: 400 })
  }

  const SERVICE_FEE_RATE = parseFloat(process.env.SOURCING_SERVICE_FEE_RATE || '0.12')
  const SHIPPING_FEE = parseInt(process.env.DOMESTIC_SHIPPING_FEE || '3000')
  const EXCHANGE_RATE = 185

  const total_krw = items.reduce((sum: number, item: { unit_price_cny: number; quantity: number }) =>
    sum + Math.round(item.unit_price_cny * EXCHANGE_RATE * item.quantity), 0
  )
  const service_fee = Math.round(total_krw * SERVICE_FEE_RATE)
  const order_number = `SO-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

  const { data: order, error } = await supabase
    .from('sourcing_orders')
    .insert({
      user_id: user.id,
      order_number,
      status: 'pending',
      items,
      total_krw,
      service_fee,
      shipping_fee: SHIPPING_FEE,
      shipping_address,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: order }, { status: 201 })
}
