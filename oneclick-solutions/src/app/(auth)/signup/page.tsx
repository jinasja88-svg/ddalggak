import { redirect } from 'next/navigation'

// 소셜 로그인만 지원 - 로그인 페이지로 리다이렉트
export default function SignupPage() {
  redirect('/login')
}
