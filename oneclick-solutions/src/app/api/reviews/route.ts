import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('product_id')
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from('reviews')
    .select('*, profile:profiles(id, name, avatar_url)')
    .order('created_at', { ascending: false })

  if (productId) query = query.eq('product_id', productId)

  const { data, error } = await query.limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const { product_id, rating, content } = await request.json()

  if (!product_id || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: '유효하지 않은 데이터입니다.' }, { status: 400 })
  }

  // 중복 리뷰 체크
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', product_id)
    .single()

  if (existing) {
    return NextResponse.json({ error: '이미 리뷰를 작성하셨습니다.' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({ user_id: user.id, product_id, rating, content })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
