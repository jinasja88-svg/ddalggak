import { NextRequest, NextResponse } from 'next/server'

const MOCK_PRODUCTS: Record<string, object> = {
  p001: {
    product_id: 'p001',
    title: '프리미엄 에코백 (로고 인쇄 가능)',
    title_zh: '高级环保袋（可定制Logo）',
    price_cny: 15.5,
    price_krw: 2870,
    images: [],
    skus: [
      { sku_id: 's1', properties: [{ name: '색상', value: '베이지' }, { name: '크기', value: '소형' }], price_cny: 15.5, stock: 200 },
      { sku_id: 's2', properties: [{ name: '색상', value: '베이지' }, { name: '크기', value: '대형' }], price_cny: 18.0, stock: 150 },
    ],
    seller: { id: 'seller001', name: '광저우 공장', rating: 4.8, location: '광저우' },
    stock: 500,
  },
  p002: {
    product_id: 'p002',
    title: '스마트폰 케이스 (아이폰 호환)',
    title_zh: 'iPhone保护壳',
    price_cny: 8.0,
    price_krw: 1480,
    images: [],
    skus: [
      { sku_id: 's1', properties: [{ name: '모델', value: 'iPhone 15' }, { name: '색상', value: '투명' }], price_cny: 8.0, stock: 300 },
    ],
    seller: { id: 'seller002', name: '선전 무역', rating: 4.5, location: '선전' },
    stock: 1000,
  },
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // TODO: OTCommerce API 연동 또는 Supabase 캐시 조회
  const product = MOCK_PRODUCTS[id]
  if (!product) {
    return NextResponse.json({ error: '상품을 찾을 수 없습니다.' }, { status: 404 })
  }

  return NextResponse.json({ data: product })
}
