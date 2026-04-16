'use client'

import dynamic from 'next/dynamic'
import ScrollToTopOnNav from '@/components/ScrollToTopOnNav'

/**
 * Wrapper client pour lazy-load les composants lourds (GSAP, Lenis, etc.)
 * Separe du layout Server Component car `ssr: false` exige `'use client'`.
 *
 * @author Lalou
 */

const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'), { ssr: false })
const WelcomeAnimation = dynamic(() => import('@/components/WelcomeAnimation'), { ssr: false })
const PageProgressBar = dynamic(() => import('@/components/PageProgressBar'), { ssr: false })
const BackToTop = dynamic(() => import('@/components/BackToTop'), { ssr: false })
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false })
const GoogleAnalytics = dynamic(() => import('@/components/GoogleAnalytics'), { ssr: false })
const ScrollDepthTracker = dynamic(() => import('@/components/ScrollDepthTracker'), { ssr: false })
const TimeOnPageTracker = dynamic(() => import('@/components/TimeOnPageTracker'), { ssr: false })
const ImageProtection = dynamic(() => import('@/components/ImageProtection'), { ssr: false })

interface ClientShellProps {
  isVipVisitor: boolean
  isPreLaunch: boolean
  children: React.ReactNode
}

export default function ClientShell({ isVipVisitor, isPreLaunch, children }: ClientShellProps) {
  return (
    <>
      <ScrollToTopOnNav />
      {!isVipVisitor && <PageProgressBar />}
      {!isVipVisitor && !isPreLaunch && <WelcomeAnimation />}

      <SmoothScroll>
        <div className="flex-1">
          {children}
        </div>
      </SmoothScroll>
      {!isVipVisitor && <BackToTop />}
      <CookieConsent />
      <GoogleAnalytics />
      <ScrollDepthTracker />
      <TimeOnPageTracker />
      <ImageProtection />
    </>
  )
}
