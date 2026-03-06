# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

딸깍러 (OneClick Solutions) - 실용적인 강의와 스마트 소프트웨어를 판매하는 플랫폼. Next.js 웹앱 + Streamlit 관리자 대시보드 + Supabase 백엔드로 구성된 모노레포.

## Commands

All commands run from the `oneclick-solutions/` directory (the git root):

```bash
npm run dev       # Next.js dev server (http://localhost:3000)
npm run build     # Production build
npm run start     # Production server
npm run lint      # ESLint check
```

Streamlit admin dashboard:
```bash
cd streamlit && streamlit run app.py
```

## Architecture

```
oneclick-solutions/
├── src/
│   ├── app/
│   │   ├── (auth)/          # login, signup, reset-password, callback
│   │   ├── (checkout)/      # checkout, success, fail pages
│   │   ├── (info)/          # about, contact, faq, notices, privacy, terms
│   │   ├── (shop)/          # courses, software, cart, wishlist, search
│   │   ├── (user)/          # mypage (orders, profile, reviews, subscription)
│   │   ├── admin/           # admin panel (products, orders, users)
│   │   ├── api/             # Route handlers (see below)
│   │   ├── pricing/
│   │   └── layout.tsx / page.tsx / globals.css
│   ├── components/
│   │   ├── admin/           # Admin panel components
│   │   ├── layout/          # Shared layout components
│   │   ├── product/         # Product display components
│   │   └── ui/              # Generic UI primitives
│   ├── lib/
│   │   ├── supabase.ts          # Browser client (Client Components)
│   │   ├── supabase-server.ts   # Server client (Server Components, Route Handlers)
│   │   ├── supabase-middleware.ts # Middleware client (session refresh only)
│   │   ├── supabase-admin.ts    # Admin client with service role (server-side only)
│   │   └── utils.ts
│   ├── middleware.ts         # Session refresh + route protection
│   └── types/index.ts        # All TypeScript types + Database type map
├── streamlit/               # Python admin dashboard
│   ├── app.py
│   ├── pages/               # 1_sales, 2_users, 3_courses, 4_orders, 5_analytics
│   └── utils/supabase_client.py
└── supabase/schema.sql      # Full DB schema — run in Supabase SQL Editor
```

**Next.js app** uses App Router (not Pages Router). Path alias `@/*` maps to `src/*`.

## Tech Stack

- **Next.js 16.1.6** (React 19, TypeScript 5, Turbopack)
- **Tailwind CSS v4** via `@tailwindcss/postcss` plugin
- **Supabase** (`@supabase/ssr` for SSR-compatible client)
- **TanStack Query v5** for client-side data fetching
- **Toss Payments** (`@tosspayments/tosspayments-sdk`) — Korean payment gateway
- **Zod v4** for schema validation, **date-fns v4** for dates
- **react-hot-toast** for notifications, **swiper** for carousels
- **lucide-react** for icons, **xlsx** for Excel handling
- **Streamlit** + pandas + plotly for admin dashboard

## Supabase Client Selection

Four separate clients — use the right one for each context:

| Client | File | Use when |
|--------|------|----------|
| `createClient()` | `supabase.ts` | Client Components (browser) |
| `createServerSupabaseClient()` | `supabase-server.ts` | Server Components, Route Handlers |
| `updateSession()` | `supabase-middleware.ts` | `middleware.ts` only |
| `createAdminClient()` | `supabase-admin.ts` | Server-side operations requiring service role (bypasses RLS) |

## Authentication & Route Protection

Middleware (`src/middleware.ts`) runs on every non-static request and handles:
- **Session refresh**: Keeps Supabase auth cookies up to date
- **Protected routes** (redirect to `/login` if unauthenticated): `/mypage`, `/checkout`, `/cart`, `/wishlist`
- **Admin routes** (`/admin`): Requires auth + email in `ADMIN_EMAILS` env var (comma-separated)
- **Auth route redirect**: Logged-in users visiting `/login` or `/signup` are sent to `/mypage`

OAuth callback is handled at `(auth)/callback/route.ts` and `api/auth/callback/route.ts`.

## API Routes

```
api/
├── auth/callback/       # Supabase OAuth code exchange
├── cart/                # Cart CRUD
├── checkout/confirm/    # Toss payment confirmation
├── orders/              # Order history
├── products/            # Product listing/filtering
├── reviews/             # Review CRUD
├── search/              # Product search
├── subscription/        # Subscription management
├── webhook/toss/        # Toss payment webhook
└── wishlist/            # Wishlist CRUD
```

## Database Schema

Schema defined in `supabase/schema.sql`. Key tables: `profiles`, `products` (type: `course`|`software`), `categories`, `cart_items`, `wishlist_items`, `orders`, `order_items`, `reviews`, `notices`, `subscription_payments`.

All tables have RLS enabled. Admin operations use service role. A trigger auto-creates a `profiles` row on `auth.users` insert.

## Design System

Color tokens defined as CSS variables in `globals.css`:
- Primary: `#0205D3` (deep blue), hover: `#0104A8`, light: `#4B4EFF`
- Backgrounds: `#FFFFFF` (white), `#F8F9FC` (surface), `#EEEFFE` (primary-bg)
- Text: `#1A1A1A` / `#525252` / `#8B8B8B` (3-tier hierarchy)
- Fonts: **Montserrat** (headings, 600-800 weight), **Pretendard** (body)

Tailwind theme is extended via `@theme inline` block in `globals.css`. Custom animations (`fade-in-up`, `float`) are defined there as well.

## Environment Variables

Copy `.env.local.example` to `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase public
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase admin (server-side only)
- `NEXT_PUBLIC_TOSS_CLIENT_KEY` / `TOSS_SECRET_KEY` — Toss Payments
- `ADMIN_EMAILS` — Comma-separated list of admin email addresses (e.g. `admin@example.com,dev@example.com`)

## 자동 로그 저장

모든 응답이 끝날 때마다 현재 세션의 대화 내역을 `prompt_log.txt` 파일에 자동으로 저장합니다.

- 기존 내용을 덮어쓰지 않고 항상 파일 끝에 추가(append)합니다
- 저장 형식:
  ```
  [날짜 시간] 사용자: (프롬프트 내용)
  [날짜 시간] AI: (응답 핵심 1-2줄 요약)
  ```
- 매 응답 후 조용히 저장하고, 별도 안내 메시지는 출력하지 않습니다
