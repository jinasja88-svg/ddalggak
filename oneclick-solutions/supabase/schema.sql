-- ==========================================
-- 딸깍러 (OneClick Solutions) 데이터베이스 스키마
-- Supabase SQL Editor에서 실행
-- ==========================================

-- 1. 사용자 프로필
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  avatar_url TEXT,
  subscription_plan TEXT NOT NULL DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'pro')),
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 카테고리
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories ON DELETE SET NULL,
  product_type TEXT CHECK (product_type IN ('course', 'software')),
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 3. 상품
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('course', 'software')),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content_html TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  discount_price INTEGER CHECK (discount_price >= 0),
  thumbnail_url TEXT,
  category_id UUID REFERENCES categories ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  download_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. 장바구니
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- 5. 위시리스트
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- 6. 주문
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  payment_key TEXT,
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. 주문 상세
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products ON DELETE CASCADE,
  price INTEGER NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0)
);

-- 8. 리뷰
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- 9. 공지사항
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. 구독 결제 내역
CREATE TABLE IF NOT EXISTS subscription_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('basic', 'pro')),
  amount INTEGER NOT NULL CHECK (amount >= 0),
  payment_key TEXT,
  billing_key TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- ==========================================
-- 인덱스
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_notices_pinned ON notices(is_pinned);

-- ==========================================
-- RLS (Row Level Security) 정책
-- ==========================================

-- profiles: 본인만 수정, 읽기는 인증된 사용자
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "프로필 본인 조회" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "프로필 본인 수정" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "프로필 자동 생성" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- products: 모두 읽기 가능
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "상품 공개 조회" ON products
  FOR SELECT USING (is_published = true);

CREATE POLICY "상품 관리자 전체 조회" ON products
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "상품 관리자 생성" ON products
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "상품 관리자 수정" ON products
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "상품 관리자 삭제" ON products
  FOR DELETE USING (auth.jwt() ->> 'role' = 'service_role');

-- categories: 모두 읽기 가능
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "카테고리 공개 조회" ON categories
  FOR SELECT USING (true);

CREATE POLICY "카테고리 관리자 관리" ON categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- cart_items: 본인 데이터만
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "장바구니 본인 조회" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "장바구니 본인 추가" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "장바구니 본인 수정" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "장바구니 본인 삭제" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- wishlist_items: 본인 데이터만
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "위시리스트 본인 조회" ON wishlist_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "위시리스트 본인 추가" ON wishlist_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "위시리스트 본인 삭제" ON wishlist_items
  FOR DELETE USING (auth.uid() = user_id);

-- orders: 본인 주문만
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "주문 본인 조회" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "주문 본인 생성" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "주문 상태 업데이트" ON orders
  FOR UPDATE USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'service_role');

-- order_items: 주문 소유자만
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "주문상세 조회" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "주문상세 생성" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- reviews: 모두 읽기, 본인만 작성/수정
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "리뷰 공개 조회" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "리뷰 본인 작성" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "리뷰 본인 수정" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "리뷰 본인 삭제" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- notices: 모두 읽기
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "공지 공개 조회" ON notices
  FOR SELECT USING (true);

CREATE POLICY "공지 관리자 관리" ON notices
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- subscription_payments: 본인만
ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "구독결제 본인 조회" ON subscription_payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "구독결제 생성" ON subscription_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 자동 프로필 생성 트리거 (Auth 가입 시)
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- updated_at 자동 갱신 트리거
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- 샘플 데이터 (선택사항 - 테스트용)
-- ==========================================

-- 카테고리 샘플
INSERT INTO categories (name, slug, product_type, sort_order) VALUES
  ('엑셀/자동화', 'excel-automation', 'course', 1),
  ('업무 생산성', 'productivity', 'course', 2),
  ('데이터 분석', 'data-analysis', 'course', 3),
  ('AI/ChatGPT', 'ai-chatgpt', 'course', 4),
  ('파일 관리', 'file-management', 'software', 1),
  ('이미지 도구', 'image-tools', 'software', 2),
  ('PDF 도구', 'pdf-tools', 'software', 3),
  ('백업/보안', 'backup-security', 'software', 4)
ON CONFLICT (slug) DO NOTHING;

-- 상품 샘플 (강의)
INSERT INTO products (type, title, slug, description, price, discount_price, category_id, is_published) VALUES
  ('course', '엑셀 자동화 마스터', 'excel-automation-master',
   '반복 작업을 매크로로 해결하는 실전 강의', 99000, 79000,
   (SELECT id FROM categories WHERE slug = 'excel-automation'), true),
  ('course', '업무 효율 200%', 'work-efficiency-200',
   '시간 관리와 도구 활용법 마스터', 79000, NULL,
   (SELECT id FROM categories WHERE slug = 'productivity'), true),
  ('course', '데이터 분석 입문', 'data-analysis-intro',
   '숫자가 말하는 인사이트를 찾는 방법', 129000, 99000,
   (SELECT id FROM categories WHERE slug = 'data-analysis'), true),
  ('course', 'AI 활용 실전 가이드', 'ai-practical-guide',
   'ChatGPT로 업무 혁신하기', 149000, 119000,
   (SELECT id FROM categories WHERE slug = 'ai-chatgpt'), true)
ON CONFLICT (slug) DO NOTHING;

-- 상품 샘플 (소프트웨어)
INSERT INTO products (type, title, slug, description, price, discount_price, category_id, is_published) VALUES
  ('software', '파일 정리 자동화', 'file-organizer',
   '폴더 구조를 자동으로 정리하는 도구', 49000, 39000,
   (SELECT id FROM categories WHERE slug = 'file-management'), true),
  ('software', '이미지 일괄 변환기', 'image-batch-converter',
   '수백 장 이미지를 한 번에 변환', 39000, NULL,
   (SELECT id FROM categories WHERE slug = 'image-tools'), true),
  ('software', 'PDF 통합 관리자', 'pdf-manager',
   'PDF 병합, 분할, 변환을 한 곳에서', 59000, 49000,
   (SELECT id FROM categories WHERE slug = 'pdf-tools'), true),
  ('software', '데이터 백업 매니저', 'data-backup-manager',
   '중요 파일 자동 백업 솔루션', 69000, NULL,
   (SELECT id FROM categories WHERE slug = 'backup-security'), true)
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- 딸깍소싱 (1688 수입대행) 스키마 추가
-- ==========================================

-- 10. 소싱 상품 캐시 (1688 상품)
CREATE TABLE IF NOT EXISTS sourcing_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT UNIQUE NOT NULL,           -- 1688 상품 ID
  title TEXT NOT NULL,                       -- 한국어 제목
  title_zh TEXT,                             -- 중국어 원제
  price_cny NUMERIC(10,2) NOT NULL,         -- 위안 가격
  price_krw INTEGER NOT NULL,               -- 원화 가격 (환산)
  images JSONB NOT NULL DEFAULT '[]',        -- 이미지 URL 배열
  skus JSONB NOT NULL DEFAULT '[]',         -- SKU 옵션 목록
  seller JSONB,                             -- 판매자 정보
  stock INTEGER,                            -- 재고
  raw_data JSONB,                           -- 원본 API 응답
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. 소싱 주문 (수입대행 주문)
CREATE TABLE IF NOT EXISTS sourcing_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'purchasing', 'shipping', 'delivered', 'cancelled')),
  items JSONB NOT NULL DEFAULT '[]',         -- 주문 아이템 목록 (상품ID, 수량, SKU, 가격)
  total_krw INTEGER NOT NULL,               -- 상품 총액 (원화)
  service_fee INTEGER NOT NULL DEFAULT 0,   -- 대행 수수료
  shipping_fee INTEGER NOT NULL DEFAULT 0,  -- 국내 배송비
  toss_payment_key TEXT,                    -- 토스 결제키
  shipping_address JSONB,                   -- 배송지 정보
  tracking_number TEXT,                     -- 운송장 번호
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. 환율 캐시
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate NUMERIC(10,4) NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

-- RLS 정책 - sourcing_products
ALTER TABLE sourcing_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sourcing_products_public_read" ON sourcing_products;
CREATE POLICY "sourcing_products_public_read"
  ON sourcing_products FOR SELECT USING (true);

-- RLS 정책 - sourcing_orders
ALTER TABLE sourcing_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sourcing_orders_own_read" ON sourcing_orders;
CREATE POLICY "sourcing_orders_own_read"
  ON sourcing_orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "sourcing_orders_own_insert" ON sourcing_orders;
CREATE POLICY "sourcing_orders_own_insert"
  ON sourcing_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS 정책 - exchange_rates
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "exchange_rates_public_read" ON exchange_rates;
CREATE POLICY "exchange_rates_public_read"
  ON exchange_rates FOR SELECT USING (true);

-- updated_at 트리거 - sourcing_products
DROP TRIGGER IF EXISTS sourcing_products_updated_at ON sourcing_products;
CREATE TRIGGER sourcing_products_updated_at
  BEFORE UPDATE ON sourcing_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- updated_at 트리거 - sourcing_orders
DROP TRIGGER IF EXISTS sourcing_orders_updated_at ON sourcing_orders;
CREATE TRIGGER sourcing_orders_updated_at
  BEFORE UPDATE ON sourcing_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 환율 초기값 (CNY → KRW, fallback 185)
INSERT INTO exchange_rates (from_currency, to_currency, rate)
VALUES ('CNY', 'KRW', 185.0)
ON CONFLICT (from_currency, to_currency) DO NOTHING;
