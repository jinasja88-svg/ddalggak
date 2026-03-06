import { Check } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '수수료 안내',
  description: '딸깍소싱 수입대행 수수료 안내.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] py-16">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[13px] font-semibold text-[#0205D3] uppercase tracking-widest">Pricing</span>
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#1A1A1A] mt-3">
            투명한 수수료 안내
          </h1>
          <p className="text-[16px] text-[#525252] mt-4 max-w-[520px] mx-auto">
            숨겨진 비용 없이 정직하게. 아래 항목이 전부입니다.
          </p>
        </div>

        {/* 수수료 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              title: '대행 수수료',
              amount: '12%',
              unit: '상품 금액 기준',
              desc: '1688에서 구매한 상품 금액의 12%를 대행 수수료로 받습니다.',
              features: ['구매 대행', '검수 서비스', 'CS 지원'],
              color: 'bg-[#0205D3]',
            },
            {
              title: '국내 배송비',
              amount: '₩3,000',
              unit: '주문 당 고정',
              desc: '국내 배송비는 주문 건 당 3,000원 고정입니다. 중량/부피 무관.',
              features: ['로켓 배송 수준', '전국 동일가', '당일 출고 가능'],
              color: 'bg-[#1A1A1A]',
            },
            {
              title: '국제 배송비',
              amount: '별도',
              unit: '무게/부피 기준',
              desc: '중국에서 한국까지 국제 배송비는 상품 무게와 부피에 따라 산정됩니다.',
              features: ['EMS/항공편 선택', '추적 서비스 포함', '통관 대행 포함'],
              color: 'bg-[#525252]',
            },
          ].map((plan, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E8E8ED] overflow-hidden">
              <div className={`${plan.color} p-6 text-white`}>
                <h3 className="text-[16px] font-bold mb-2">{plan.title}</h3>
                <p className="text-[36px] font-extrabold">{plan.amount}</p>
                <p className="text-[13px] opacity-70 mt-1">{plan.unit}</p>
              </div>
              <div className="p-6">
                <p className="text-[14px] text-[#525252] mb-4 leading-relaxed">{plan.desc}</p>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[14px] text-[#1A1A1A]">
                      <Check size={16} className="text-[#0205D3] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* 예시 계산 */}
        <div className="bg-white rounded-2xl border border-[#E8E8ED] p-8 mb-8">
          <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-6">가격 계산 예시</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-[#E8E8ED]">
                  <th className="text-left py-2 text-text-secondary font-semibold">항목</th>
                  <th className="text-right py-2 text-text-secondary font-semibold">금액</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                <tr>
                  <td className="py-3 text-[#1A1A1A]">상품 금액 (¥100 × 환율 185)</td>
                  <td className="py-3 text-right font-medium">₩18,500</td>
                </tr>
                <tr>
                  <td className="py-3 text-[#1A1A1A]">대행 수수료 (12%)</td>
                  <td className="py-3 text-right font-medium">₩2,220</td>
                </tr>
                <tr>
                  <td className="py-3 text-[#1A1A1A]">국내 배송비</td>
                  <td className="py-3 text-right font-medium">₩3,000</td>
                </tr>
                <tr>
                  <td className="py-3 text-[#1A1A1A]">국제 배송비 (예시 500g)</td>
                  <td className="py-3 text-right font-medium">₩8,000~</td>
                </tr>
                <tr className="border-t-2 border-[#0205D3]">
                  <td className="py-3 font-bold text-[#1A1A1A]">예상 합계</td>
                  <td className="py-3 text-right font-extrabold text-[#0205D3] text-[18px]">₩31,720~</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[12px] text-text-tertiary mt-4">* 환율은 실시간으로 변동됩니다. 국제 배송비는 상품 수령 후 정산됩니다.</p>
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-block px-8 py-3.5 bg-[#0205D3] text-white text-[15px] font-semibold rounded-xl hover:bg-[#0104A8] transition-all shadow-md"
          >
            지금 소싱 시작하기
          </Link>
        </div>
      </div>
    </div>
  )
}
