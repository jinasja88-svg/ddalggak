'use client'

import { useState, FormEvent } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Send, CheckCircle } from 'lucide-react'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.'
    }
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.'
    }
    if (!formData.subject.trim()) {
      newErrors.subject = '제목을 입력해주세요.'
    }
    if (!formData.message.trim()) {
      newErrors.message = '문의 내용을 입력해주세요.'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = '문의 내용은 10자 이상 입력해주세요.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    // TODO: Supabase 또는 API를 통한 문의 전송 구현
    // 현재는 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-success-bg border border-success/20 rounded-xl p-8 text-center">
        <CheckCircle size={48} className="mx-auto text-success mb-4" />
        <h3 className="text-[18px] font-bold text-text-primary mb-2">
          문의가 접수되었습니다
        </h3>
        <p className="text-[14px] text-text-secondary mb-6">
          영업일 기준 1~2일 이내에 입력하신 이메일로 답변드리겠습니다.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setIsSubmitted(false)
            setFormData({ name: '', email: '', subject: '', message: '' })
          }}
        >
          새 문의 작성
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Input
          label="이름"
          placeholder="홍길동"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
        />
        <Input
          label="이메일"
          type="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          required
        />
      </div>

      <Input
        label="제목"
        placeholder="문의 제목을 입력해주세요"
        value={formData.subject}
        onChange={(e) => handleChange('subject', e.target.value)}
        error={errors.subject}
        required
      />

      <div className="w-full">
        <label
          htmlFor="message"
          className="block text-[14px] font-medium text-text-primary mb-1.5"
        >
          문의 내용
        </label>
        <textarea
          id="message"
          rows={6}
          placeholder="문의하실 내용을 자세히 적어주세요"
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          className={`w-full px-4 py-2.5 text-[15px] text-text-primary bg-white border rounded-lg outline-none transition-all duration-200 placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/10 resize-vertical ${
            errors.message ? 'border-error focus:border-error focus:ring-error/10' : 'border-border'
          }`}
          required
        />
        {errors.message && (
          <p className="mt-1.5 text-[13px] text-error">{errors.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" loading={isSubmitting} className="gap-2">
        <Send size={16} />
        문의 보내기
      </Button>
    </form>
  )
}
