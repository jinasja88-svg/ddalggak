'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/callback`,
    })

    setLoading(false)
    if (error) {
      toast.error('비밀번호 재설정 메일 발송에 실패했습니다.')
      return
    }

    setSent(true)
    toast.success('비밀번호 재설정 메일을 발송했습니다.')
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="text-[28px] font-extrabold text-primary">
            딸깍러
          </Link>
          <p className="text-[15px] text-text-secondary mt-2">
            비밀번호를 재설정합니다
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-success-bg rounded-full flex items-center justify-center mx-auto">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-[15px] text-text-secondary">
              <strong>{email}</strong>으로<br />
              비밀번호 재설정 링크를 발송했습니다.
            </p>
            <p className="text-[13px] text-text-tertiary">
              메일함을 확인해주세요. 메일이 도착하지 않으면 스팸 폴더를 확인해주세요.
            </p>
            <Link
              href="/login"
              className="inline-block mt-4 text-[14px] text-primary font-semibold hover:underline"
            >
              로그인으로 돌아가기
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <Input
              label="가입한 이메일"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="가입 시 사용한 이메일을 입력하세요."
              required
            />
            <Button type="submit" fullWidth size="lg" loading={loading}>
              재설정 링크 보내기
            </Button>
            <p className="text-center">
              <Link
                href="/login"
                className="text-[14px] text-text-tertiary hover:text-primary transition-colors"
              >
                로그인으로 돌아가기
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
