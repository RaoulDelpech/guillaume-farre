'use client'

import dynamic from 'next/dynamic'
import ScrollToTopOnNav from '@/components/ScrollToTopOnNav'

/**
 * Wrapper client pour lazy-load les composants lourds (GSAP, Lenis, etc.)
 * Separe du layout Server Component car `ssr: false` exige `'use client'`.
 *
 * @author Lalou
 */

import SmoothScroll from '@/components/SmoothScroll'
const WelcomeAnimation = dynamic(() => import('@/components/WelcomeAnimation'), { ssr: false })
const PageProgressBar = dynamic(() => import('@/components/PageProgressBar'), { ssr: false })
const BackToTop = dynamic(() => import('@/components/BackToTop'), { ssr: false })
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false })
const GoogleAnalytics = dynamic(() => import('@/components/GoogleAnalytics'), { ssr: false })
const ClarityAnalytics = dynamic(() => import('@/components/ClarityAnalytics'), { ssr: false })
const MatomoAnalytics = dynamic(() => import('@/components/MatomoAnalytics'), { ssr: false })
const ScrollDepthTracker = dynamic(() => import('@/components/ScrollDepthTracker'), { ssr: false })
const TimeOnPageTracker = dynamic(() => import('@/components/TimeOnPageTracker'), { ssr: false })
const WebVitalsReporter = dynamic(() => import('@/components/WebVitalsReporter'), { ssr: false })
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

      <SmoothScroll />
      <div className="flex-1">
        {children}
      </div>
      {!isVipVisitor && <BackToTop />}
      <CookieConsent />
      <GoogleAnalytics />
      <ClarityAnalytics />
      <MatomoAnalytics />
      <ScrollDepthTracker />
      <TimeOnPageTracker />
      <WebVitalsReporter />
      <ImageProtection />
    </>
  )
}
