'use client'
import { default as dynamicImport } from 'next/dynamic'
const Page = dynamicImport(() => import('@/app/approved-stores/page'), { ssr: false })
export default function DashboardWrapper(props: any) {
  return Page ? <Page {...props} /> : null
}
