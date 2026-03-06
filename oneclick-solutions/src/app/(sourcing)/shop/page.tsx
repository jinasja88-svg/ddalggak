import { Suspense } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '소싱하기',
  description: '1688 상품을 검색하고 수입대행을 신청하세요.',
}

// Mock 데이터 (실제 OTCommerce API 연동 전)
const MOCK_PRODUCTS = [
  { id: 'p001', title: '프리미엄 에코백 (로고 인쇄 가능)', price_cny: 15.5, price_krw: 2870, image: null, seller: '광저우 공장', stock: 500 },
  { id: 'p002', title: '스마트폰 케이스 (아이폰 호환)', price_cny: 8.0, price_krw: 1480, image: null, seller: '선전 무역', stock: 1000 },
  { id: 'p003', title: '스테인리스 텀블러 500ml', price_cny: 25.0, price_krw: 4625, image: null, seller: '항저우 공장', stock: 200 },
  { id: 'p004', title: '면 티셔츠 오버핏 (다양한 색상)', price_cny: 35.0, price_krw: 6475, image: null, seller: '광저우 의류', stock: 300 },
  { id: 'p005', title: 'LED 조명 USB 충전식', price_cny: 12.0, price_krw: 2220, image: null, seller: '선전 전자', stock: 800 },
  { id: 'p006', title: '실리콘 주방 용품 세트', price_cny: 42.0, price_krw: 7770, image: null, seller: '이우 생활', stock: 150 },
  { id: 'p007', title: '여행용 화장품 파우치', price_cny: 18.0, price_krw: 3330, image: null, seller: '광저우 잡화', stock: 600 },
  { id: 'p008', title: '미니 블루투스 스피커', price_cny: 55.0, price_krw: 10175, image: null, seller: '선전 전자', stock: 100 },
]

const CATEGORIES = ['전체', '가방/잡화', '의류', '전자제품', '생활용품', '뷰티', '완구/취미']

function ProductGrid({ query }: { query: string; category?: string }) {
  const filtered = query
    ? MOCK_PRODUCTS.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
    : MOCK_PRODUCTS

  return (
    <>
      <p className="text-[14px] text-text-secondary mb-4">
        {query ? `"${query}" 검색 결과 ${filtered.length}개` : `전체 상품 ${filtered.length}개`}
      </p>
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[16px] text-text-secondary">검색 결과가 없습니다.</p>
          <p className="text-[14px] text-text-tertiary mt-2">다른 키워드로 검색해보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="bg-white rounded-2xl border border-[#E8E8ED] overflow-hidden hover:shadow-[0px_8px_24px_rgba(2,5,211,0.08)] hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="h-44 bg-gradient-to-br from-[#EEEFFE] to-[#D8D9FF] flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              <div className="p-4">
                <p className="text-[14px] font-semibold text-[#1A1A1A] mb-1 line-clamp-2 leading-snug">{product.title}</p>
                <p className="text-[12px] text-text-tertiary mb-3">{product.seller}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[16px] font-extrabold text-primary">
                      ₩{product.price_krw.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-text-tertiary">¥{product.price_cny}</p>
                  </div>
                  <span className="text-[11px] text-text-tertiary">재고 {product.stock}+</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-text-secondary">로딩 중...</p></div>}>
      <ShopContent searchParams={searchParams} />
    </Suspense>
  )
}

async function ShopContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const params = await searchParams
  const query = params.q || ''
  const category = params.category || '전체'

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* 검색 헤더 */}
      <div className="bg-white border-b border-[#E8E8ED] py-6">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <form action="/shop" method="get" className="flex gap-2 max-w-[640px]">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8B8B]" />
              <input
                name="q"
                type="text"
                defaultValue={query}
                placeholder="1688 상품 검색..."
                className="w-full pl-11 pr-4 py-3 text-[15px] border border-[#E8E8ED] rounded-xl focus:outline-none focus:border-[#0205D3] focus:ring-2 focus:ring-[#0205D3]/10 bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-[#0205D3] text-white text-[14px] font-semibold rounded-xl hover:bg-[#0104A8] transition-colors"
            >
              검색
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
        {/* 카테고리 탭 */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={cat === '전체' ? `/shop${query ? `?q=${query}` : ''}` : `/shop?category=${cat}${query ? `&q=${query}` : ''}`}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-medium transition-colors border ${
                category === cat || (cat === '전체' && !params.category)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-text-secondary border-[#E8E8ED] hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* 상품 그리드 */}
        <ProductGrid query={query} category={category} />
      </div>
    </div>
  )
}
