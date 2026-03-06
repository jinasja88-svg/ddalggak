import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white py-16">
      <div className="container-krds">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* 브랜드 */}
          <div>
            <h3 className="text-[20px] font-extrabold text-white mb-4">
              딸깍소싱
            </h3>
            <p className="text-[14px] text-[#8B8B8B] leading-relaxed">
              중국 1688 수입대행을<br />
              클릭 한 번으로 해결하는 플랫폼
            </p>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="text-[14px] font-bold text-white mb-5 uppercase tracking-wider">
              서비스
            </h4>
            <ul className="space-y-3 text-[14px] text-[#8B8B8B]">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors duration-200">
                  소싱하기
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors duration-200">
                  수입대행이란
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors duration-200">
                  수수료 안내
                </Link>
              </li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h4 className="text-[14px] font-bold text-white mb-5 uppercase tracking-wider">
              고객지원
            </h4>
            <ul className="space-y-3 text-[14px] text-[#8B8B8B]">
              <li>
                <Link href="/notices" className="hover:text-white transition-colors duration-200">
                  공지사항
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors duration-200">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors duration-200">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* 법적 고지 */}
          <div>
            <h4 className="text-[14px] font-bold text-white mb-5 uppercase tracking-wider">
              법적 고지
            </h4>
            <ul className="space-y-3 text-[14px] text-[#8B8B8B]">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors duration-200">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 사업자 정보 */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="text-[12px] text-[#525252] leading-relaxed space-y-1">
            <p>상호: 딸깍소싱 | 대표: 홍길동</p>
            <p>사업자등록번호: 000-00-00000 | 통신판매업신고: 제0000-서울강남-00000호</p>
            <p>주소: 서울특별시 강남구 테헤란로 000, 0층</p>
            <p>이메일: support@ddalkkagsourcing.kr | 전화: 02-0000-0000</p>
          </div>
          <div className="mt-6 text-center text-[13px] text-[#525252]">
            &copy; {new Date().getFullYear()} 딸깍소싱. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
