'use client'

import { motion } from 'framer-motion'
import { TestimonialSlider } from '../testimonial-slider'

export function TestimonialSection() {
  return (
    <section className="px-6 py-16">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <TestimonialSlider />
      </motion.div>
    </section>
  )
}