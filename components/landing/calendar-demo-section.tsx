'use client'

import Image from "next/image"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

export function CalendarDemoSection() {
  return (
    <section className="bg-black text-white px-6 py-16">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl lg:text-4xl font-bold mb-8">
          Built specifically for people<br />
          who have important meetings<br />
          (with the ocean)
        </h2>
        <div className="bg-white rounded-lg p-4 max-w-3xl mx-auto">
          <Image
            src="https://surfslot.pt/public/playground_assets/frame%2049-600h.png"
            alt="Calendar interface"
            width={600}
            height={400}
            className="w-full"
          />
        </div>
        <p className="mt-8 text-gray-400">
          Avoid having your team mates scheduling meetings when it is good to surf
        </p>
        <Button variant="outline" className="mt-4 text-white border-white hover:bg-white/10">
          Explore pricing plans →
        </Button>
      </motion.div>
    </section>
  )
}