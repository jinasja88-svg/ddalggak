import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  const body = await request.json()
  const { eventType, data } = body

  const supabase = createAdminClient()

  switch (eventType) {
    case 'PAYMENT_STATUS_CHANGED': {
      const { orderId, status, paymentKey } = data

      let orderStatus: string
      switch (status) {
        case 'DONE':
          orderStatus = 'paid'
          break
        case 'CANCELED':
          orderStatus = 'cancelled'
          break
        case 'PARTIAL_CANCELED':
          orderStatus = 'refunded'
          break
        default:
          orderStatus = 'pending'
      }

      await supabase
        .from('orders')
        .update({
          status: orderStatus,
          payment_key: paymentKey,
        })
        .eq('order_number', orderId)

      break
    }
  }

  return NextResponse.json({ success: true })
}
