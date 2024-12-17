
'use client'

import Image from "next/image"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

interface CtaSectionProps {
  onSignIn: () => void
}

export function CtaSection({ onSignIn }: CtaSectionProps) {
  return (
    <section className="bg-[#B3E6E5] py-24 px-6">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-8">
          Get started with<br />surfslot now!
        </h2>
        <Button
          onClick={onSignIn}
          className="bg-black text-white hover:bg-gray-800"
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
    </section>
  )
}