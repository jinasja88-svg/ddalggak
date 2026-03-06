'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import type { SourcingOrderStatus } from '@/types'

const STATUS_FLOW: SourcingOrderStatus[] = ['pending', 'paid', 'purchasing', 'shipping', 'delivered']
const STATUS_LABELS: Record<SourcingOrderStatus, string> = {
  pending: '결제 대기',
  paid: '결제 완료',
  purchasing: '구매 진행',
  shipping: '배송 중',
  delivered: '배송 완료',
  cancelled: '취소됨',
}

interface Props {
  orderId: string
  currentStatus: SourcingOrderStatus
}

export default function AdminOrderActions({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [tracking, setTracking] = useState('')
  const [loading, setLoading] = useState(false)
  const [showTrackingInput, setShowTrackingInput] = useState(false)

  const currentIdx = STATUS_FLOW.indexOf(status)
  const nextStatus = currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : null

  const handleStatusChange = async (newStatus: SourcingOrderStatus) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/sourcing/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('상태 변경 실패')
      setStatus(newStatus)
      toast.success('상태가 변경되었습니다.')
    } catch {
      toast.error('상태 변경에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleTrackingSubmit = async () => {
    if (!tracking.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/sourcing/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'shipping', tracking_number: tracking }),
      })
      if (!res.ok) throw new Error('운송장 등록 실패')
      setStatus('shipping')
      setShowTrackingInput(false)
      toast.success('운송장이 등록되었습니다.')
    } catch {
      toast.error('운송장 등록에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      {nextStatus && nextStatus !== 'shipping' && (
        <button
          onClick={() => handleStatusChange(nextStatus)}
          disabled={loading}
          className="px-3 py-1.5 text-[12px] bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          → {STATUS_LABELS[nextStatus]}
        </button>
      )}

      {nextStatus === 'shipping' && !showTrackingInput && (
        <button
          onClick={() => setShowTrackingInput(true)}
          className="px-3 py-1.5 text-[12px] bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
        >
          운송장 등록
        </button>
      )}

      {showTrackingInput && (
        <div className="flex gap-1">
          <input
            type="text"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="운송장 번호"
            className="w-28 px-2 py-1 text-[12px] border border-[#E8E8ED] rounded-lg focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleTrackingSubmit}
            disabled={loading}
            className="px-2 py-1 text-[12px] bg-primary text-white rounded-lg disabled:opacity-50"
          >
            등록
          </button>
        </div>
      )}

      {status !== 'cancelled' && status !== 'delivered' && (
        <button
          onClick={() => handleStatusChange('cancelled')}
          disabled={loading}
          className="px-3 py-1.5 text-[12px] text-red-500 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          취소
        </button>
      )}
    </div>
  )
}
