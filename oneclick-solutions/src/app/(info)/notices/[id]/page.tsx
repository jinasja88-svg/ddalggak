export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Pin, Calendar } from 'lucide-react'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: notice } = await supabase
    .from('notices')
    .select('title')
    .eq('id', id)
    .single()

  if (!notice) return { title: '공지사항을 찾을 수 없습니다' }
  return {
    title: notice.title,
  }
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: notice } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .single()

  if (!notice) notFound()

  return (
    <div className="container-krds py-8">
      <Breadcrumb
        items={[
          { label: '공지사항', href: '/notices' },
          { label: notice.title },
        ]}
      />

      <article className="mt-8 max-w-3xl">
        {/* 헤더 */}
        <div className="mb-8">
          {notice.is_pinned && (
            <Badge variant="primary" className="mb-3">
              <Pin size={12} className="mr-1" />
              고정 공지
            </Badge>
          )}
          <h1 className="text-[24px] md:text-[28px] font-extrabold text-text-primary leading-tight">
            {notice.title}
          </h1>
          <div className="flex items-center gap-2 mt-3 text-[14px] text-text-tertiary">
            <Calendar size={14} />
            <time dateTime={notice.created_at}>
              {formatDate(notice.created_at)}
            </time>
          </div>
        </div>

        {/* 본문 */}
        <div className="border-t border-border pt-8">
          <div className="prose max-w-none text-[15px] text-text-secondary leading-relaxed whitespace-pre-wrap">
            {notice.content}
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <div className="mt-12 pt-6 border-t border-border">
          <Link
            href="/notices"
            className="inline-flex items-center gap-2 text-[14px] text-text-secondary hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            목록으로 돌아가기
          </Link>
        </div>
      </article>
    </div>
  )
}
