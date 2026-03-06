import Breadcrumb from '@/components/ui/Breadcrumb'
import ContactForm from './ContactForm'
import { Mail, MessageCircle, Clock, MapPin } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '문의하기',
  description: '딸깍러에 궁금한 점이 있으시면 문의해주세요. 빠르게 답변드리겠습니다.',
}

const contactInfo = [
  {
    icon: Mail,
    title: '이메일',
    description: 'contact@oneclick.kr',
    sub: '영업일 기준 1~2일 이내 답변',
  },
  {
    icon: MessageCircle,
    title: '카카오톡 채널',
    description: '@딸깍러',
    sub: '실시간 상담 가능',
    href: 'https://pf.kakao.com/_딸깍러',
  },
  {
    icon: Clock,
    title: '운영 시간',
    description: '평일 10:00 ~ 18:00',
    sub: '주말 및 공휴일 휴무',
  },
  {
    icon: MapPin,
    title: '주소',
    description: '서울특별시 (상세 주소 추후 공개)',
    sub: '방문 상담은 사전 예약 필요',
  },
]

export default function ContactPage() {
  return (
    <div className="container-krds py-8">
      <Breadcrumb items={[{ label: '문의하기' }]} />

      <div className="mt-6 mb-10">
        <h1 className="text-[28px] md:text-[32px] font-extrabold text-text-primary">
          문의하기
        </h1>
        <p className="text-[15px] text-text-secondary mt-2">
          궁금한 점이 있으시면 아래 양식을 작성하거나 카카오톡 채널로 문의해주세요
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* 문의 폼 */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        {/* 연락처 정보 */}
        <div className="space-y-4">
          {contactInfo.map((info) => (
            <div
              key={info.title}
              className="bg-surface rounded-xl p-5 border border-border"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-bg flex items-center justify-center flex-shrink-0">
                  <info.icon size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-text-primary">
                    {info.title}
                  </h3>
                  {info.href ? (
                    <a
                      href={info.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] text-primary hover:underline mt-0.5 block"
                    >
                      {info.description}
                    </a>
                  ) : (
                    <p className="text-[14px] text-text-secondary mt-0.5">
                      {info.description}
                    </p>
                  )}
                  <p className="text-[12px] text-text-tertiary mt-1">{info.sub}</p>
                </div>
              </div>
            </div>
          ))}

          {/* 카카오 채널 바로가기 */}
          <a
            href="https://pf.kakao.com/_딸깍러"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#FEE500] text-[#3C1E1E] font-semibold text-[14px] py-3 rounded-xl hover:bg-[#FDD800] transition-colors"
          >
            <MessageCircle size={18} />
            카카오톡 채널 바로가기
          </a>
        </div>
      </div>
    </div>
  )
}
