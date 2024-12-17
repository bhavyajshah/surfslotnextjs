
'use client'

import { motion } from 'framer-motion'

export function FaqSection() {
  return (
    <section className="px-6 py-16 bg-gray-50">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">How does the app block time slots on my calendar?</h3>
            <p className="text-gray-600">
              The app integrates with Google Calendar and scans your calendar for any conflicting events. It then blocks out time slots that are good for surfing based on the online surfing forecast information it uses.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Is this app free to use?</h3>
            <p className="text-gray-600">
              The app is free by default at this stage. We are preparing a premium plan to provide your surfslots with even more customisation.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">What devices is this app compatible with?</h3>
            <p className="text-gray-600">
              The app will be available as a website, which means that it can be accessed using any device with a web browser.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}