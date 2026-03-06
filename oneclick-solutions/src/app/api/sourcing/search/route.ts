import { NextRequest, NextResponse } from 'next/server'


// Mock 데이터 (OTCommerce API 연동 전 fallback)
const MOCK_RESULTS = [
  { product_id: 'p001', title: '프리미엄 에코백 (로고 인쇄 가능)', price_cny: 15.5, price_krw: 2870, images: [], seller: { name: '광저우 공장' }, stock: 500 },
  { product_id: 'p002', title: '스마트폰 케이스 (아이폰 호환)', price_cny: 8.0, price_krw: 1480, images: [], seller: { name: '선전 무역' }, stock: 1000 },
  { product_id: 'p003', title: '스테인리스 텀블러 500ml', price_cny: 25.0, price_krw: 4625, images: [], seller: { name: '항저우 공장' }, stock: 200 },
  { product_id: 'p004', title: '면 티셔츠 오버핏 (다양한 색상)', price_cny: 35.0, price_krw: 6475, images: [], seller: { name: '광저우 의류' }, stock: 300 },
  { product_id: 'p005', title: 'LED 조명 USB 충전식', price_cny: 12.0, price_krw: 2220, images: [], seller: { name: '선전 전자' }, stock: 800 },
  { product_id: 'p006', title: '실리콘 주방 용품 세트', price_cny: 42.0, price_krw: 7770, images: [], seller: { name: '이우 생활' }, stock: 150 },
  { product_id: 'p007', title: '여행용 화장품 파우치', price_cny: 18.0, price_krw: 3330, images: [], seller: { name: '광저우 잡화' }, stock: 600 },
  { product_id: 'p008', title: '미니 블루투스 스피커', price_cny: 55.0, price_krw: 10175, images: [], seller: { name: '선전 전자' }, stock: 100 },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20

  // TODO: OTCommerce API 연동 시 여기서 실제 검색 호출
  // 현재는 Supabase 캐시 또는 mock 데이터 반환

  let results = MOCK_RESULTS
  if (q) {
    results = MOCK_RESULTS.filter(p =>
      p.title.toLowerCase().includes(q.toLowerCase())
    )
  }

  const total = results.length
  const start = (page - 1) * limit
  const data = results.slice(start, start + limit)

  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}
