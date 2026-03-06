/** 가격 포맷 (원 단위 → ₩1,000 형태) */
export function formatPrice(price: number): string {
  return `₩${price.toLocaleString('ko-KR')}`
}

/** 날짜 포맷 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** 짧은 날짜 포맷 */
export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/** 주문번호 생성 */
export function generateOrderNumber(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${dateStr}-${random}`
}

/** 할인율 계산 */
export function calcDiscountRate(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100)
}

/** className 유틸리티 (조건부 클래스 결합) */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

/** 주문 상태 한글 변환 */
export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: '결제 대기',
    paid: '결제 완료',
    cancelled: '주문 취소',
    refunded: '환불 완료',
  }
  return labels[status] || status
}

/** 구독 플랜 한글 변환 */
export function getPlanLabel(plan: string): string {
  const labels: Record<string, string> = {
    free: 'FREE',
    basic: '베이직',
    pro: '프로',
  }
  return labels[plan] || plan
}

/** 텍스트 말줄임 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}
