import { NextResponse } from 'next/server'

const CATEGORIES = [
  { id: 'cat001', name: '가방/잡화', name_zh: '包包/杂货', slug: 'bags', emoji: '👜' },
  { id: 'cat002', name: '의류', name_zh: '服装', slug: 'clothing', emoji: '👕' },
  { id: 'cat003', name: '전자제품', name_zh: '电子产品', slug: 'electronics', emoji: '📱' },
  { id: 'cat004', name: '생활용품', name_zh: '生活用品', slug: 'household', emoji: '🏠' },
  { id: 'cat005', name: '뷰티', name_zh: '美妆', slug: 'beauty', emoji: '💄' },
  { id: 'cat006', name: '완구/취미', name_zh: '玩具/爱好', slug: 'toys', emoji: '🧸' },
  { id: 'cat007', name: '스포츠', name_zh: '运动', slug: 'sports', emoji: '⚽' },
  { id: 'cat008', name: '식품', name_zh: '食品', slug: 'food', emoji: '🍜' },
]

export async function GET() {
  return NextResponse.json({ data: CATEGORIES })
}
