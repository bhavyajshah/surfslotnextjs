
'use client'

import Image from "next/image"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

interface HeroSectionProps {
  // onSignIn: () => void
  animations: {
    fadeInUp: any
    stagger: any
  }
}

export function HeroSection({  animations }: HeroSectionProps) {
  const { fadeInUp, stagger } = animations

  return (
    <section className="pt-32 px-6 pb-16 lg:py-24">
      <motion.div
        className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <div>
          <motion.h1
            className="text-4xl lg:text-6xl font-bold leading-tight"
            variants={fadeInUp}
          >
            do not loose that surf session in{" "}
            <span className="text-blue-600">ericeira</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-gray-600 max-w-md"
            variants={fadeInUp}
          >
            Surfslot is your scheduling automation platform for monitoring
            the great days of surf that you have been missing because of meetings
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button
              onClick={() => signIn('google')}
              className="mt-8 bg-black text-white hover:bg-gray-800"
            >
              <Image
                src="https://surfslot.pt/public/playground_assets/google-logo-png-suite-everything-you-need-know-about-google-newest-0-200h.png"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign in with Google
            </Button>
          </motion.div>
        </div>
        <motion.div
          className="relative aspect-[4/3]"
          variants={fadeInUp}
        >
          <Image
            src="https://surfslot.pt/public/playground_assets/1-png-aef2a3%20%5B1%5D-1200w.jpg"
            alt="Surfing scene"
            fill
            className="object-cover rounded-lg"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}