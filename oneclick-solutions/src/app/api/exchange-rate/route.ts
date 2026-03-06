import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const FALLBACK_RATE = 185
const CACHE_TTL_HOURS = 1

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    // Supabase 캐시에서 환율 조회
    const { data: cached } = await supabase
      .from('exchange_rates')
      .select('*')
      .eq('from_currency', 'CNY')
      .eq('to_currency', 'KRW')
      .single()

    if (cached) {
      const cacheAge = (Date.now() - new Date(cached.fetched_at).getTime()) / 1000 / 3600
      if (cacheAge < CACHE_TTL_HOURS) {
        return NextResponse.json({
          from: 'CNY',
          to: 'KRW',
          rate: cached.rate,
          cached: true,
          fetched_at: cached.fetched_at,
        })
      }
    }

    // TODO: 외부 환율 API 연동 (예: ExchangeRate-API)
    // const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/CNY/KRW`)
    // const json = await response.json()
    // const rate = json.conversion_rate

    // 현재는 fallback 값 사용
    const rate = FALLBACK_RATE

    // 캐시 업데이트
    await supabase
      .from('exchange_rates')
      .upsert({ from_currency: 'CNY', to_currency: 'KRW', rate, fetched_at: new Date().toISOString() })

    return NextResponse.json({ from: 'CNY', to: 'KRW', rate, cached: false })
  } catch {
    return NextResponse.json({ from: 'CNY', to: 'KRW', rate: FALLBACK_RATE, cached: false, fallback: true })
  }
}
