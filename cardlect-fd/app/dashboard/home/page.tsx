'use client'
import { default as dynamicImport } from 'next/dynamic'
const Page = dynamicImport(() => import('@/app/page'), { ssr: false })
export default function DashboardWrapper(props: any) {
  return Page ? <Page {...props} /> : null
}
