import { NextResponse } from 'next/server'

// 이미지 검색 스캐폴딩 - OTCommerce 이미지 검색 API 연동 예정
export async function POST() {
  // TODO: 이미지 업로드 후 1688 이미지 검색 연동
  return NextResponse.json({
    error: '이미지 검색 기능은 준비 중입니다.',
    message: 'OTCommerce API 키 설정 후 활성화됩니다.',
  }, { status: 501 })
}
