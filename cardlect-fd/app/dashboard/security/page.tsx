'use client'
import { default as dynamicImport } from 'next/dynamic'
const Page = dynamicImport(() => import('@/app/security/page'), { ssr: false })
export default function DashboardWrapper(props: any) {
  return Page ? <Page {...props} /> : null
}
