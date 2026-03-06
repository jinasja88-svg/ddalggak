export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Star } from 'lucide-react'
import { formatDateShort } from '@/lib/utils'
import Breadcrumb from '@/components/ui/Breadcrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '내 리뷰' }

export default async function ReviewsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/mypage/reviews')

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, product:products(title, slug, type)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container-krds py-8">
      <Breadcrumb items={[{ label: '마이페이지', href: '/mypage' }, { label: '내 리뷰' }]} />

      <h1 className="text-[24px] font-extrabold text-text-primary mt-6 mb-8">
        내 리뷰
      </h1>

      {!reviews || reviews.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[17px] text-text-tertiary">작성한 리뷰가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: Record<string, unknown>) => (
            <div key={review.id} className="bg-white border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-semibold text-text-primary">
                  {review.product?.title || '상품'}
                </h3>
                <span className="text-[12px] text-text-tertiary">
                  {formatDateShort(review.created_at)}
                </span>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < review.rating
                        ? 'fill-warning text-warning'
                        : 'text-border'
                    }
                  />
                ))}
              </div>
              {review.content && (
                <p className="text-[14px] text-text-secondary">{review.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
