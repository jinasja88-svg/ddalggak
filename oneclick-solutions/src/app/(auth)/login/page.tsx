'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

function LoginContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/mypage'
  const supabase = createClient()

  const handleOAuth = async (provider: 'google' | 'kakao') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/callback?redirect=${redirect}`,
      },
    })
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <Link href="/" className="text-[28px] font-extrabold text-primary">
            딸깍소싱
          </Link>
          <p className="text-[15px] text-text-secondary mt-2">
            소셜 계정으로 간편하게 시작하세요
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleOAuth('google')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-border rounded-xl hover:bg-surface transition-colors text-[15px] font-medium shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google로 로그인
          </button>

          <button
            onClick={() => handleOAuth('kakao')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#FEE500] border border-[#FEE500] rounded-xl hover:bg-[#FADA0A] transition-colors text-[15px] font-medium text-[#191919] shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#191919">
              <path d="M12 3C6.48 3 2 6.44 2 10.65c0 2.68 1.76 5.03 4.42 6.38l-1.13 4.13c-.1.36.3.65.62.45l4.93-3.27c.37.04.75.06 1.16.06 5.52 0 10-3.44 10-7.75S17.52 3 12 3z"/>
            </svg>
            카카오로 로그인
          </button>
        </div>

        <div className="mt-8 p-4 bg-[#F8F9FC] rounded-xl border border-[#E8E8ED]">
          <p className="text-[13px] text-[#525252] text-center leading-relaxed">
            로그인 시 딸깍소싱의{' '}
            <Link href="/terms" className="text-primary hover:underline">이용약관</Link>
            {' '}및{' '}
            <Link href="/privacy" className="text-primary hover:underline">개인정보처리방침</Link>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center">
        <p className="text-text-secondary">로딩 중...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
