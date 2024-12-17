'use client'
import { useEffect, useState } from 'react'
import { signIn } from "next-auth/react"
import { Navigation } from './landing/navigation'
import { HeroSection } from './landing/hero-section'
import { CalendarDemoSection } from './landing/calendar-demo-section'
import { StatsSection } from './landing/stats-section'
import { FeaturesSection } from './landing/features-section'
import { PricingSection } from './landing/pricing-section'
import { TestimonialSection } from './landing/testimonial-section'
import { FaqSection } from './landing/faq-section'
import { CtaSection } from './landing/cta-section'
import { Footer } from './landing/footer'
import { WhatsAppButton } from './whatsapp-button'

export default function SurfslotLanding() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleGoogleSignIn = () => {
    signIn('google')
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        isScrolled={isScrolled}
        onSignIn={handleGoogleSignIn}
      />

      <HeroSection
        onSignIn={handleGoogleSignIn}
        animations={{
          fadeInUp: {
            initial: { y: 20, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            transition: { duration: 0.5 }
          },
          stagger: {
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }
        }}
      />

      <CalendarDemoSection />
      <StatsSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialSection />
      <FaqSection />

      <CtaSection onSignIn={handleGoogleSignIn} />
      <Footer />

      <WhatsAppButton />
    </div>
  )
}
