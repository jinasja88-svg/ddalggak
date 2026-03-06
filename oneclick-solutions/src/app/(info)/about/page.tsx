import Breadcrumb from '@/components/ui/Breadcrumb'
import { Target, Eye, Users, Lightbulb, Zap, Heart } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '소개',
  description: '딸깍러는 생활의 불편함을 해결하는 실용적인 강의와 스마트 소프트웨어를 제공합니다.',
}

const values = [
  {
    icon: Lightbulb,
    title: '실용성 우선',
    description: '이론보다 실무에 즉시 적용 가능한 콘텐츠를 만듭니다.',
  },
  {
    icon: Zap,
    title: '빠른 문제 해결',
    description: '복잡한 문제를 클릭 한 번으로 해결하는 솔루션을 추구합니다.',
  },
  {
    icon: Heart,
    title: '사용자 중심',
    description: '사용자의 피드백을 반영하여 끊임없이 개선합니다.',
  },
]

const team = [
  {
    name: '팀원 1',
    role: 'CEO / 기획',
    description: '서비스 전략 수립 및 전체 방향을 이끌고 있습니다.',
  },
  {
    name: '팀원 2',
    role: '개발 / 엔지니어링',
    description: '소프트웨어 개발과 기술적 문제 해결을 담당합니다.',
  },
  {
    name: '팀원 3',
    role: '콘텐츠 / 마케팅',
    description: '강의 기획 및 마케팅 전략을 수립합니다.',
  },
]

export default function AboutPage() {
  return (
    <div className="container-krds py-8">
      <Breadcrumb items={[{ label: '소개' }]} />

      {/* 히어로 섹션 */}
      <section className="mt-8 mb-16">
        <h1 className="text-[32px] md:text-[40px] font-extrabold text-text-primary leading-tight">
          딸깍러를 소개합니다
        </h1>
        <p className="text-[16px] md:text-[18px] text-text-secondary mt-4 max-w-2xl leading-relaxed">
          &ldquo;딸깍&rdquo; 하고 클릭 한 번이면 해결되는 세상을 만들어갑니다.
          복잡하고 반복적인 일상의 문제들을 실용적인 강의와 스마트한 소프트웨어로
          빠르게 해결할 수 있도록 돕는 것이 딸깍러의 목표입니다.
        </p>
      </section>

      {/* 미션 & 비전 */}
      <section className="mb-16 grid md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl p-8 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-bg flex items-center justify-center">
              <Target size={20} className="text-primary" />
            </div>
            <h2 className="text-[22px] font-bold text-text-primary">미션</h2>
          </div>
          <p className="text-[15px] text-text-secondary leading-relaxed">
            누구나 쉽게 접근할 수 있는 실용적인 교육 콘텐츠와 업무 자동화 도구를
            제공하여, 일상과 업무의 효율을 극대화합니다. 기술의 장벽을 낮추고
            모든 사람이 디지털 도구를 자유롭게 활용할 수 있는 환경을 만듭니다.
          </p>
        </div>
        <div className="bg-surface rounded-xl p-8 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-bg flex items-center justify-center">
              <Eye size={20} className="text-primary" />
            </div>
            <h2 className="text-[22px] font-bold text-text-primary">비전</h2>
          </div>
          <p className="text-[15px] text-text-secondary leading-relaxed">
            대한민국에서 가장 실용적인 교육 및 소프트웨어 플랫폼이 되는 것.
            &ldquo;딸깍&rdquo; 하나로 모든 문제가 해결되는 세상, 누구나 자신의
            역량을 한 단계 높일 수 있는 세상을 만들어 가겠습니다.
          </p>
        </div>
      </section>

      {/* 핵심 가치 */}
      <section className="mb-16">
        <h2 className="text-[24px] font-bold text-text-primary mb-8">핵심 가치</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {values.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl p-6 border border-border hover:shadow-[var(--card-shadow-hover)] transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-bg flex items-center justify-center mb-4">
                <item.icon size={24} className="text-primary" />
              </div>
              <h3 className="text-[17px] font-bold text-text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 팀 소개 */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary-bg flex items-center justify-center">
            <Users size={20} className="text-primary" />
          </div>
          <h2 className="text-[24px] font-bold text-text-primary">팀 소개</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-surface rounded-xl p-6 border border-border text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary-bg mx-auto mb-4 flex items-center justify-center">
                <span className="text-[24px] font-bold text-primary">
                  {member.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-[17px] font-bold text-text-primary">
                {member.name}
              </h3>
              <p className="text-[13px] text-primary font-semibold mt-1">
                {member.role}
              </p>
              <p className="text-[14px] text-text-secondary mt-3 leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 연혁 / 추가 정보 */}
      <section className="mb-8">
        <h2 className="text-[24px] font-bold text-text-primary mb-6">회사 정보</h2>
        <div className="bg-surface rounded-xl p-6 md:p-8 border border-border">
          <dl className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <dt className="text-[13px] text-text-tertiary font-medium">회사명</dt>
              <dd className="text-[15px] text-text-primary mt-1">딸깍러 (OneClick Solutions)</dd>
            </div>
            <div>
              <dt className="text-[13px] text-text-tertiary font-medium">설립일</dt>
              <dd className="text-[15px] text-text-primary mt-1">2025년</dd>
            </div>
            <div>
              <dt className="text-[13px] text-text-tertiary font-medium">사업 분야</dt>
              <dd className="text-[15px] text-text-primary mt-1">온라인 교육, 소프트웨어 판매</dd>
            </div>
            <div>
              <dt className="text-[13px] text-text-tertiary font-medium">이메일</dt>
              <dd className="text-[15px] text-text-primary mt-1">contact@oneclick.kr</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}
