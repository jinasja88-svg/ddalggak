import Breadcrumb from '@/components/ui/Breadcrumb'
import FaqAccordion from './FaqAccordion'
import { HelpCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: '딸깍러 서비스에 대해 자주 묻는 질문과 답변을 확인하세요.',
}

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqCategory {
  name: string
  items: FaqItem[]
}

const faqData: FaqCategory[] = [
  {
    name: '일반',
    items: [
      {
        question: '딸깍러는 어떤 서비스인가요?',
        answer:
          '딸깍러는 실용적인 온라인 강의와 업무 자동화 소프트웨어를 판매하는 플랫폼입니다. 일상과 업무에서 발생하는 반복적이고 복잡한 문제를 "딸깍" 한 번으로 해결할 수 있도록 돕는 것을 목표로 합니다.',
      },
      {
        question: '회원가입은 어떻게 하나요?',
        answer:
          '홈페이지 우측 상단의 "회원가입" 버튼을 클릭하면 이메일로 간편하게 가입할 수 있습니다. 소셜 로그인(Google, Kakao)도 지원 예정입니다.',
      },
      {
        question: '서비스 이용 시간이 있나요?',
        answer:
          '딸깍러의 모든 온라인 서비스는 24시간 연중무휴로 이용 가능합니다. 다만, 서버 점검 등으로 일시적으로 서비스가 중단될 수 있으며, 사전에 공지사항을 통해 안내드립니다.',
      },
      {
        question: '고객센터 운영 시간은 어떻게 되나요?',
        answer:
          '고객센터는 평일 오전 10시부터 오후 6시까지 운영됩니다. 주말 및 공휴일은 휴무이며, 문의 페이지를 통해 남겨주신 문의는 영업일 기준 1~2일 이내에 답변드립니다.',
      },
    ],
  },
  {
    name: '결제',
    items: [
      {
        question: '어떤 결제 수단을 이용할 수 있나요?',
        answer:
          '신용카드, 체크카드, 계좌이체, 간편결제(토스페이, 카카오페이, 네이버페이) 등 다양한 결제 수단을 지원합니다. 결제는 토스페이먼츠를 통해 안전하게 처리됩니다.',
      },
      {
        question: '결제 후 환불이 가능한가요?',
        answer:
          '강의는 수강 시작 전이라면 결제일로부터 7일 이내에 전액 환불이 가능합니다. 소프트웨어의 경우 다운로드 전이면 환불이 가능하며, 다운로드 후에는 제품 결함이 있는 경우에만 환불이 가능합니다. 자세한 환불 정책은 이용약관을 참고해주세요.',
      },
      {
        question: '영수증이나 세금계산서를 발급받을 수 있나요?',
        answer:
          '네, 결제 완료 후 마이페이지 > 주문내역에서 영수증을 확인하실 수 있습니다. 세금계산서 발행이 필요한 경우 문의 페이지를 통해 사업자등록증과 함께 요청해주시면 처리해 드립니다.',
      },
    ],
  },
  {
    name: '강의',
    items: [
      {
        question: '강의 수강 기간이 있나요?',
        answer:
          '대부분의 강의는 구매 후 무기한 수강이 가능합니다. 일부 기간 한정 강의의 경우 상품 상세 페이지에서 수강 기간을 확인하실 수 있습니다.',
      },
      {
        question: '강의 영상을 다운로드할 수 있나요?',
        answer:
          '저작권 보호를 위해 강의 영상의 다운로드는 지원하지 않습니다. 온라인 스트리밍 방식으로만 수강하실 수 있으며, PC와 모바일 모두에서 이용 가능합니다.',
      },
      {
        question: '강의 내용에 대해 질문하고 싶어요.',
        answer:
          '각 강의의 수강 페이지에 Q&A 게시판이 마련되어 있습니다. 질문을 남기시면 강사가 직접 답변을 드립니다. 일반적인 문의는 문의하기 페이지를 이용해주세요.',
      },
      {
        question: '수강 완료 후 수료증이 발급되나요?',
        answer:
          '네, 강의를 100% 수강 완료하시면 마이페이지에서 수료증을 다운로드하실 수 있습니다. 수료증에는 수강자 이름, 강의명, 수료일이 기재됩니다.',
      },
    ],
  },
  {
    name: '소프트웨어',
    items: [
      {
        question: '소프트웨어 설치 방법을 알려주세요.',
        answer:
          '구매 완료 후 마이페이지 > 주문내역에서 다운로드 링크를 확인할 수 있습니다. 다운로드한 파일을 실행하여 안내에 따라 설치하시면 됩니다. 각 소프트웨어의 상세 설치 가이드는 상품 페이지에서 확인하실 수 있습니다.',
      },
      {
        question: '소프트웨어 업데이트는 어떻게 받나요?',
        answer:
          '소프트웨어 업데이트는 구매 후 1년간 무료로 제공됩니다. 자동 업데이트 기능이 포함된 소프트웨어의 경우 실행 시 자동으로 업데이트가 진행되며, 수동 업데이트가 필요한 경우 마이페이지에서 최신 버전을 다운로드하실 수 있습니다.',
      },
      {
        question: '여러 기기에서 사용할 수 있나요?',
        answer:
          '기본적으로 1개의 라이선스로 최대 2대의 기기에서 사용 가능합니다. 추가 기기에서 사용하려면 별도의 라이선스를 구매하셔야 합니다. 기업용 라이선스가 필요한 경우 문의 페이지를 통해 연락해주세요.',
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <div className="container-krds py-8">
      <Breadcrumb items={[{ label: 'FAQ' }]} />

      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-bg flex items-center justify-center">
            <HelpCircle size={20} className="text-primary" />
          </div>
          <h1 className="text-[28px] md:text-[32px] font-extrabold text-text-primary">
            자주 묻는 질문
          </h1>
        </div>
        <p className="text-[15px] text-text-secondary mt-3">
          궁금한 점이 있으신가요? 아래에서 자주 묻는 질문과 답변을 확인해보세요.
        </p>
      </div>

      <FaqAccordion categories={faqData} />
    </div>
  )
}
