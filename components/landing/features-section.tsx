
'use client'

import { motion } from 'framer-motion'
import { Users, BarChart3, Calendar, Smartphone } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-16 bg-gray-50">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-sm uppercase tracking-wide text-gray-600">Features</h3>
        <h2 className="mt-4 text-3xl font-bold">Everything you get with surfslot</h2>
        <p className="mt-4 text-gray-600 max-w-2xl">
          We are building surfslot, the main functionality is completed to analyze
          but reach out to us if you have ideas on how to improve it or if you
          would like to have it in your location!
        </p>

        <div className="mt-12 grid md:grid-cols-4 gap-8">
          <Card>
            <CardContent className="pt-6">
              <Users className="w-6 h-6 mb-4" />
              <h3 className="font-semibold mb-2">Account</h3>
              <p className="text-sm text-gray-600">Your own account to manage your surfing plans</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <BarChart3 className="w-6 h-6 mb-4" />
              <h3 className="font-semibold mb-2">Accurate Forecasts</h3>
              <p className="text-sm text-gray-600">We feed you scheduling with accurate surfing forecasts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Calendar className="w-6 h-6 mb-4" />
              <h3 className="font-semibold mb-2">Google Calendar</h3>
              <p className="text-sm text-gray-600">Full integration to fully sync with Google Calendar</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Smartphone className="w-6 h-6 mb-4" />
              <h3 className="font-semibold mb-2">Multiple Devices</h3>
              <p className="text-sm text-gray-600">Web application that can be used in all devices</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </section>
  )
}