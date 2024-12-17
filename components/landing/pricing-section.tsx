'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-16">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-center text-3xl font-bold mb-12">No setup cost or hidden fees.</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="font-semibold mb-4">Standard</div>
              <div className="text-lg mb-2">Standard plan for busy surfers</div>
              <div className="text-3xl font-bold mb-6">Free</div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Sync with your Google Calendar
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Choose your favourite spots
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Configure your location
                </li>
              </ul>
              <Button className="w-full mt-6 bg-[#B3E6E5] text-black hover:bg-[#93d6d5]">
                Get Standard
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="font-semibold mb-4">Plus</div>
              <div className="text-lg mb-2">Augmented plan for top performers</div>
              <div className="text-3xl font-bold mb-6">€2<span className="text-sm font-normal">/month</span></div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  All Standard features
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Configure your surf conditions
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Define your surf skills
                </li>
              </ul>
              <Button className="w-full mt-6 bg-[#B3E6E5] text-black hover:bg-[#93d6d5]">
                Available soon
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 text-white">
            <CardContent className="p-6">
              <div className="font-semibold mb-4">Expand</div>
              <div className="text-xl mb-6">This is simple, no one needs to expand</div>
              <Button variant="outline" className="w-full mt-6 text-white border-white hover:bg-white/10">
                Contact us
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </section>
  )
}