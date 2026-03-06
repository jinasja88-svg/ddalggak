'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Breadcrumb from '@/components/ui/Breadcrumb'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login?redirect=/mypage/profile')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('name, phone')
        .eq('id', user.id)
        .single()

      if (profile) {
        setName(profile.name || '')
        setPhone(profile.phone || '')
      }
      setFetching(false)
    }
    fetch()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ name, phone })
      .eq('id', user.id)

    setLoading(false)
    if (error) {
      toast.error('프로필 저장에 실패했습니다.')
      return
    }
    toast.success('프로필이 저장되었습니다.')
  }

  if (fetching) return null

  return (
    <div className="container-krds py-8">
      <Breadcrumb items={[{ label: '마이페이지', href: '/mypage' }, { label: '프로필 수정' }]} />

      <h1 className="text-[24px] font-extrabold text-text-primary mt-6 mb-8">
        프로필 수정
      </h1>

      <div className="max-w-[480px]">
        <form onSubmit={handleSave} className="space-y-5">
          <Input
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
          />
          <Input
            label="전화번호"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
          />
          <Button type="submit" loading={loading}>
            저장하기
          </Button>
        </form>
      </div>
    </div>
  )
}
