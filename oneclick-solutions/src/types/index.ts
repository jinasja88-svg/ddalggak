// ==========================================
// 딸깍소싱 타입 정의
// ==========================================

// --- 기본 타입 ---
export type ProductType = 'course' | 'software'
export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'refunded'
export type SourcingOrderStatus = 'pending' | 'paid' | 'purchasing' | 'shipping' | 'delivered' | 'cancelled'

// --- 사용자 프로필 ---
export interface Profile {
  id: string
  email: string
  name: string | null
  phone: string | null
  avatar_url: string | null
  subscription_plan: string
  subscription_expires_at: string | null
  created_at: string
}

// --- 소싱 상품 (1688) ---
export interface SourcingProduct {
  id: string
  product_id: string
  title: string
  title_zh: string | null
  price_cny: number
  price_krw: number
  images: string[]
  skus: SourcingSku[]
  seller: SourcingSeller | null
  stock: number | null
  raw_data: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface SourcingSku {
  sku_id: string
  properties: Array<{ name: string; value: string }>
  price_cny: number
  stock: number
}

export interface SourcingSeller {
  id: string
  name: string
  rating: number | null
  location: string | null
}

// --- 소싱 주문 아이템 ---
export interface SourcingOrderItem {
  product_id: string
  title: string
  image: string
  quantity: number
  sku_id: string | null
  sku_label: string | null
  unit_price_cny: number
  unit_price_krw: number
}

// --- 배송지 ---
export interface ShippingAddress {
  name: string
  phone: string
  postal_code: string
  address: string
  address_detail: string
}

// --- 소싱 주문 ---
export interface SourcingOrder {
  id: string
  user_id: string
  order_number: string
  status: SourcingOrderStatus
  items: SourcingOrderItem[]
  total_krw: number
  service_fee: number
  shipping_fee: number
  toss_payment_key: string | null
  shipping_address: ShippingAddress | null
  tracking_number: string | null
  created_at: string
  updated_at: string
}

// --- 환율 ---
export interface ExchangeRate {
  id: string
  from_currency: string
  to_currency: string
  rate: number
  fetched_at: string
}

// --- 공지사항 ---
export interface Notice {
  id: string
  title: string
  content: string
  is_pinned: boolean
  created_at: string
}

// --- API 요청/응답 타입 ---
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// --- Toss Payments ---
export interface TossPaymentRequest {
  orderId: string
  amount: number
  orderName: string
  customerName: string
  customerEmail: string
}

export interface TossPaymentConfirm {
  paymentKey: string
  orderId: string
  amount: number
}

export interface TossPaymentResponse {
  paymentKey: string
  orderId: string
  status: string
  totalAmount: number
  method: string
  approvedAt: string
}

// --- Supabase Database 타입 ---
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'> & { created_at?: string }
        Update: Partial<Omit<Profile, 'id'>>
      }
      notices: {
        Row: Notice
        Insert: Omit<Notice, 'id' | 'created_at'>
        Update: Partial<Omit<Notice, 'id'>>
      }
      sourcing_products: {
        Row: SourcingProduct
        Insert: Omit<SourcingProduct, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SourcingProduct, 'id' | 'created_at'>>
      }
      sourcing_orders: {
        Row: SourcingOrder
        Insert: Omit<SourcingOrder, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SourcingOrder, 'id' | 'created_at' | 'user_id'>>
      }
      exchange_rates: {
        Row: ExchangeRate
        Insert: Omit<ExchangeRate, 'id'>
        Update: Partial<Pick<ExchangeRate, 'rate' | 'fetched_at'>>
      }
    }
  }
}
