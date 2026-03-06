export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { Pin, FileText } from 'lucide-react'
import type { Metadata } from 'next'
import type { Notice } from '@/types'

export const metadata: Metadata = {
  title: '공지사항',
  description: '딸깍러의 최신 공지사항과 업데이트 소식을 확인하세요.',
}

export default async function NoticesPage() {
  const supabase = await createServerSupabaseClient()

  // 고정 공지 먼저, 그 다음 날짜 역순
  const { data: notices } = await supabase
    .from('notices')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  const noticeList: Notice[] = notices || []

  return (
    <div className="container-krds py-8">
      <Breadcrumb items={[{ label: '공지사항' }]} />

      <div className="mt-6 mb-8">
        <h1 className="text-[28px] md:text-[32px] font-extrabold text-text-primary">
          공지사항
        </h1>
        <p className="text-[15px] text-text-secondary mt-2">
          딸깍러의 새로운 소식과 업데이트를 확인하세요
        </p>
      </div>

      {noticeList.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={48} className="mx-auto text-text-tertiary mb-4" />
          <p className="text-[15px] text-text-tertiary">
            등록된 공지사항이 없습니다.
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="text-left text-[13px] font-semibold text-text-secondary px-6 py-3 w-16">
                  구분
                </th>
                <th className="text-left text-[13px] font-semibold text-text-secondary px-6 py-3">
                  제목
                </th>
                <th className="text-left text-[13px] font-semibold text-text-secondary px-6 py-3 w-36 hidden sm:table-cell">
                  작성일
                </th>
              </tr>
            </thead>
            <tbody>
              {noticeList.map((notice) => (
                <tr
                  key={notice.id}
                  className="border-b border-border last:border-b-0 hover:bg-surface/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    {notice.is_pinned ? (
                      <Badge variant="primary">
                        <Pin size={12} className="mr-1" />
                        고정
                      </Badge>
                    ) : (
                      <Badge variant="default">일반</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/notices/${notice.id}`}
                      className="text-[15px] text-text-primary hover:text-primary transition-colors font-medium"
                    >
                      {notice.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-text-tertiary hidden sm:table-cell">
                    {formatDate(notice.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
