import Link from "next/link";
import { Search, Package, Truck, CheckCircle, TrendingUp, Shield, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-28 lg:pt-28 lg:pb-36">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#EEEFFE] via-[#F5F5FF] to-transparent rounded-full blur-3xl opacity-60 -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#EEEFFE] to-transparent rounded-full blur-3xl opacity-40 translate-y-1/3 -translate-x-1/4" />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative">
          <div className="max-w-[760px] mx-auto text-center">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center px-4 py-1.5 bg-[#EEEFFE] text-[#0205D3] text-[13px] font-semibold rounded-full mb-6">
                1688 수입대행 플랫폼
              </span>
            </div>
            <h1 className="animate-fade-in-up-delay-1 text-[40px] md:text-[56px] font-extrabold text-[#1A1A1A] leading-[1.15] tracking-tight mb-6">
              중국 1688 수입대행을<br />
              <span className="text-[#0205D3]">클릭 한 번</span>으로
            </h1>
            <p className="animate-fade-in-up-delay-2 text-[17px] md:text-[19px] text-[#525252] leading-relaxed mb-10 max-w-[540px] mx-auto">
              상품 검색부터 주문, 배송까지 한 번에.<br className="hidden md:block" />
              투명한 수수료와 실시간 환율로 소싱하세요.
            </p>

            {/* 검색바 */}
            <div className="animate-fade-in-up-delay-3 max-w-[580px] mx-auto">
              <form action="/shop" method="get" className="flex gap-2">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8B8B]" />
                  <input
                    name="q"
                    type="text"
                    placeholder="찾으시는 상품을 검색하세요 (예: 에코백, 스마트폰 케이스)"
                    className="w-full pl-11 pr-4 py-3.5 text-[15px] border border-[#E8E8ED] rounded-xl focus:outline-none focus:border-[#0205D3] focus:ring-2 focus:ring-[#0205D3]/10 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#0205D3] text-white text-[15px] font-semibold rounded-xl hover:bg-[#0104A8] transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  소싱하기
                </button>
              </form>
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {['에코백', '폰케이스', '텀블러', '의류', '전자제품'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/shop?q=${tag}`}
                    className="px-3 py-1 text-[13px] text-[#525252] bg-[#F8F9FC] hover:bg-[#EEEFFE] hover:text-[#0205D3] rounded-full transition-colors border border-[#E8E8ED]"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 통계 */}
          <div className="mt-20 grid grid-cols-3 max-w-[600px] mx-auto">
            <div className="text-center">
              <p className="text-[32px] font-extrabold text-[#0205D3]">12%</p>
              <p className="text-[14px] text-[#8B8B8B] mt-1">투명한 수수료</p>
            </div>
            <div className="text-center border-x border-[#E8E8ED]">
              <p className="text-[32px] font-extrabold text-[#0205D3]">실시간</p>
              <p className="text-[14px] text-[#8B8B8B] mt-1">환율 적용</p>
            </div>
            <div className="text-center">
              <p className="text-[32px] font-extrabold text-[#0205D3]">빠른</p>
              <p className="text-[14px] text-[#8B8B8B] mt-1">주문 처리</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-[#F8F9FC]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[13px] font-semibold text-[#0205D3] uppercase tracking-widest">How It Works</span>
            <h2 className="text-[32px] md:text-[36px] font-extrabold text-[#1A1A1A] mt-3">
              3단계로 끝나는 수입대행
            </h2>
            <p className="text-[16px] text-[#525252] mt-4 max-w-[480px] mx-auto">
              복잡한 수입 절차는 저희가 처리합니다. 당신은 원하는 상품만 골라주세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search size={28} className="text-[#0205D3]" />,
                step: "01",
                title: "상품 검색",
                desc: "1688에서 원하는 상품을 검색하세요. 실시간 환율로 원화 가격을 바로 확인할 수 있습니다.",
              },
              {
                icon: <Package size={28} className="text-[#0205D3]" />,
                step: "02",
                title: "소싱 신청",
                desc: "수량과 옵션을 선택하고 배송지를 입력하면 끝. 복잡한 서류 작업은 필요 없습니다.",
              },
              {
                icon: <Truck size={28} className="text-[#0205D3]" />,
                step: "03",
                title: "문 앞 배송",
                desc: "저희가 직접 1688에서 구매 후 국내로 배송합니다. 실시간 배송 현황을 확인하세요.",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 right-0 translate-x-1/2 text-[#E8E8ED] z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                )}
                <div className="bg-white p-8 rounded-2xl border border-[#E8E8ED] hover:border-[#0205D3]/20 hover:shadow-[0px_8px_24px_rgba(2,5,211,0.08)] transition-all duration-300">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 bg-[#EEEFFE] rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-[40px] font-extrabold text-[#E8E8ED]">{item.step}</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-2">{item.title}</h3>
                  <p className="text-[15px] text-[#525252] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 장점 */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[13px] font-semibold text-[#0205D3] uppercase tracking-widest">Why Us</span>
            <h2 className="text-[32px] md:text-[36px] font-extrabold text-[#1A1A1A] mt-3">
              딸깍소싱을 선택해야 하는 이유
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <TrendingUp size={28} className="text-[#0205D3]" />,
                title: "투명한 수수료 12%",
                desc: "숨겨진 비용 없이 딱 12%만 받습니다. 상품가격 + 수수료 + 국내배송비가 전부입니다.",
              },
              {
                icon: <Shield size={28} className="text-[#0205D3]" />,
                title: "실시간 환율 적용",
                desc: "최신 CNY-KRW 환율을 실시간으로 반영합니다. 환율 변동에 따른 손해를 최소화하세요.",
              },
              {
                icon: <Clock size={28} className="text-[#0205D3]" />,
                title: "빠른 주문 처리",
                desc: "주문 접수 후 영업일 1-2일 내 중국 발주. 배송 현황을 실시간으로 확인하세요.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-[#E8E8ED] hover:border-[#0205D3]/20 transition-all duration-300 hover:shadow-[0px_8px_24px_rgba(2,5,211,0.08)] group"
              >
                <div className="w-14 h-14 bg-[#EEEFFE] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#0205D3] transition-colors duration-300 [&_svg]:group-hover:text-white">
                  {item.icon}
                </div>
                <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-2">{item.title}</h3>
                <p className="text-[15px] text-[#525252] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 인기 카테고리 */}
      <section className="py-24 bg-[#F8F9FC]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[13px] font-semibold text-[#0205D3] uppercase tracking-widest">Categories</span>
              <h2 className="text-[28px] md:text-[32px] font-extrabold text-[#1A1A1A] mt-2">인기 소싱 카테고리</h2>
            </div>
            <Link href="/shop" className="text-[14px] font-semibold text-[#0205D3] hover:underline underline-offset-4">
              전체보기 &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { emoji: "👜", label: "가방/잡화", q: "가방" },
              { emoji: "👕", label: "의류", q: "의류" },
              { emoji: "📱", label: "전자제품", q: "전자제품" },
              { emoji: "🏠", label: "생활용품", q: "생활용품" },
              { emoji: "💄", label: "뷰티", q: "뷰티" },
              { emoji: "🧸", label: "완구/취미", q: "완구" },
            ].map((cat, i) => (
              <Link
                key={i}
                href={`/shop?q=${cat.q}`}
                className="bg-white rounded-2xl border border-[#E8E8ED] p-5 text-center hover:border-[#0205D3]/30 hover:shadow-[0px_4px_16px_rgba(2,5,211,0.08)] transition-all duration-200 group"
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <p className="text-[13px] font-semibold text-[#525252] group-hover:text-[#0205D3] transition-colors">{cat.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0205D3] to-[#4B4EFF]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/50 rounded-full" />
        </div>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center relative">
          <h2 className="text-[32px] md:text-[40px] font-extrabold text-white mb-4 leading-tight">
            지금 바로 소싱 시작하기
          </h2>
          <p className="text-[17px] text-white/70 mb-10 max-w-[440px] mx-auto">
            Google 또는 Kakao 계정으로 1분 만에 가입하고 바로 소싱을 시작하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-white text-[#0205D3] text-[15px] font-bold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              상품 둘러보기
            </Link>
            <Link
              href="/about"
              className="px-8 py-3.5 bg-transparent text-white text-[15px] font-semibold rounded-xl border-2 border-white/30 hover:border-white/60 transition-all duration-200"
            >
              수입대행이란?
            </Link>
          </div>
        </div>
      </section>

      {/* 수수료 안내 미니 배너 */}
      <section className="py-12 bg-[#F8F9FC] border-t border-[#E8E8ED]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <CheckCircle size={24} className="text-[#0205D3] mb-2" />
              <p className="text-[14px] font-semibold text-[#1A1A1A]">대행 수수료 12%</p>
              <p className="text-[13px] text-[#8B8B8B]">상품 금액 기준 정률 적용</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle size={24} className="text-[#0205D3] mb-2" />
              <p className="text-[14px] font-semibold text-[#1A1A1A]">국내 배송비 3,000원</p>
              <p className="text-[13px] text-[#8B8B8B]">중량/부피에 관계없이 단일가</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle size={24} className="text-[#0205D3] mb-2" />
              <p className="text-[14px] font-semibold text-[#1A1A1A]">국제 배송비 별도</p>
              <p className="text-[13px] text-[#8B8B8B]">상품 무게/크기에 따라 산정</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
