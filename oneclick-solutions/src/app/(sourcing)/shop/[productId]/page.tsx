'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

// Mock 데이터
const MOCK_PRODUCTS: Record<string, {
  id: string
  title: string
  title_zh: string
  price_cny: number
  price_krw: number
  seller: string
  stock: number
  images: string[]
  skus: Array<{ id: string; label: string; price_cny: number; stock: number }>
  description: string
}> = {
  p001: {
    id: 'p001',
    title: '프리미엄 에코백 (로고 인쇄 가능)',
    title_zh: '高级环保袋（可定制Logo）',
    price_cny: 15.5,
    price_krw: 2870,
    seller: '광저우 공장',
    stock: 500,
    images: [],
    skus: [
      { id: 's1', label: '베이지 / 소형 (30×35cm)', price_cny: 15.5, stock: 200 },
      { id: 's2', label: '베이지 / 대형 (40×45cm)', price_cny: 18.0, stock: 150 },
      { id: 's3', label: '검정 / 소형 (30×35cm)', price_cny: 15.5, stock: 100 },
      { id: 's4', label: '검정 / 대형 (40×45cm)', price_cny: 18.0, stock: 50 },
    ],
    description: '친환경 면 소재로 제작된 에코백. 로고 인쇄 가능. MOQ 50개.',
  },
  p002: {
    id: 'p002',
    title: '스마트폰 케이스 (아이폰 호환)',
    title_zh: 'iPhone保护壳',
    price_cny: 8.0,
    price_krw: 1480,
    seller: '선전 무역',
    stock: 1000,
    images: [],
    skus: [
      { id: 's1', label: 'iPhone 15 / 투명', price_cny: 8.0, stock: 300 },
      { id: 's2', label: 'iPhone 15 Pro / 투명', price_cny: 8.5, stock: 200 },
      { id: 's3', label: 'iPhone 15 / 검정', price_cny: 8.0, stock: 250 },
    ],
    description: 'TPU 소재 스마트폰 케이스. 충격 흡수 설계.',
    },
}

const SERVICE_FEE_RATE = 0.12
const SHIPPING_FEE = 3000
const EXCHANGE_RATE = 185

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.productId as string

  const product = MOCK_PRODUCTS[productId] || {
    id: productId,
    title: '상품 정보를 불러오는 중...',
    title_zh: '',
    price_cny: 0,
    price_krw: 0,
    seller: '-',
    stock: 0,
    images: [],
    skus: [],
    description: '',
  }

  const [selectedSku, setSelectedSku] = useState(product.skus[0]?.id || '')
  const [quantity, setQuantity] = useState(1)

  const selectedSkuData = product.skus.find(s => s.id === selectedSku)
  const unitPriceCny = selectedSkuData?.price_cny || product.price_cny
  const unitPriceKrw = Math.round(unitPriceCny * EXCHANGE_RATE)
  const subtotal = unitPriceKrw * quantity
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE)
  const total = subtotal + serviceFee + SHIPPING_FEE

  const handleApply = () => {
    toast.success('소싱 신청을 위해 로그인이 필요합니다.')
    router.push('/login?redirect=/sourcing-orders')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-8">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* 브레드크럼 */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-[14px] text-text-secondary hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={16} />
          소싱하기로 돌아가기
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 상품 이미지 */}
          <div className="bg-white rounded-2xl border border-[#E8E8ED] overflow-hidden">
            <div className="h-80 bg-gradient-to-br from-[#EEEFFE] to-[#D8D9FF] flex items-center justify-center">
              <span className="text-6xl">📦</span>
            </div>
          </div>

          {/* 상품 정보 */}
          <div className="bg-white rounded-2xl border border-[#E8E8ED] p-6">
            <div className="mb-2">
              <span className="text-[12px] text-text-tertiary">{product.seller}</span>
            </div>
            <h1 className="text-[22px] font-bold text-[#1A1A1A] mb-1">{product.title}</h1>
            {product.title_zh && (
              <p className="text-[13px] text-text-tertiary mb-4">{product.title_zh}</p>
            )}

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-[28px] font-extrabold text-primary">
                ¥{unitPriceCny}
              </span>
              <span className="text-[16px] text-text-secondary">
                ≈ ₩{unitPriceKrw.toLocaleString()}
              </span>
            </div>

            {/* SKU 선택 */}
            {product.skus.length > 0 && (
              <div className="mb-4">
                <label className="block text-[14px] font-semibold text-[#1A1A1A] mb-2">
                  옵션 선택
                </label>
                <div className="relative">
                  <select
                    value={selectedSku}
                    onChange={(e) => setSelectedSku(e.target.value)}
                    className="w-full py-3 px-4 pr-10 border border-[#E8E8ED] rounded-xl text-[14px] text-[#1A1A1A] focus:outline-none focus:border-primary appearance-none bg-white"
                  >
                    {product.skus.map((sku) => (
                      <option key={sku.id} value={sku.id}>
                        {sku.label} — ¥{sku.price_cny} (재고 {sku.stock}개)
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                </div>
              </div>
            )}

            {/* 수량 */}
            <div className="mb-6">
              <label className="block text-[14px] font-semibold text-[#1A1A1A] mb-2">
                수량
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-lg border border-[#E8E8ED] flex items-center justify-center text-[18px] hover:border-primary transition-colors"
                >
                  −
                </button>
                <span className="text-[16px] font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-lg border border-[#E8E8ED] flex items-center justify-center text-[18px] hover:border-primary transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* 가격 계산기 */}
            <div className="bg-[#F8F9FC] rounded-xl p-4 mb-6 space-y-2 text-[14px]">
              <div className="flex justify-between text-text-secondary">
                <span>상품 금액 ({quantity}개)</span>
                <span>₩{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>대행 수수료 (12%)</span>
                <span>₩{serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>국내 배송비</span>
                <span>₩{SHIPPING_FEE.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-text-secondary text-[12px]">
                <span>국제 배송비</span>
                <span>별도 (무게에 따라 산정)</span>
              </div>
              <hr className="border-[#E8E8ED]" />
              <div className="flex justify-between font-bold text-[#1A1A1A] text-[15px]">
                <span>예상 합계</span>
                <span className="text-primary">₩{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleApply}
              className="w-full py-3.5 bg-primary text-white text-[15px] font-semibold rounded-xl hover:bg-primary-hover transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              소싱 신청하기
            </button>

            <p className="text-[12px] text-text-tertiary text-center mt-3">
              환율 기준: ¥1 = ₩{EXCHANGE_RATE} (실시간 업데이트)
            </p>
          </div>
        </div>

        {/* 상품 설명 */}
        {product.description && (
          <div className="mt-6 bg-white rounded-2xl border border-[#E8E8ED] p-6">
            <h2 className="text-[18px] font-bold text-[#1A1A1A] mb-4">상품 설명</h2>
            <p className="text-[15px] text-[#525252] leading-relaxed">{product.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
