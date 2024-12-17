'use client'

import { motion } from 'framer-motion'

export function StatsSection() {
  return (
    <section className="px-6 py-16 border-t">
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <div className="text-4xl font-bold">200k</div>
          <p className="mt-2 text-gray-600">waves that are not surfed in ericeira because of conflicting meetings</p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold">5 meetings</div>
          <p className="mt-2 text-gray-600">per week that can be done earlier or afterwards (or even never)</p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold">10 meetings</div>
          <p className="mt-2 text-gray-600">per week that you are checking but your focus is on the forecast</p>
        </div>
      </motion.div>
    </section>
  )
}