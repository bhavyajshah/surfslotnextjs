'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const testimonials = [
  {
    quote: "It just works. Forecasts are accurate as wow and the meetings better fit my calendar and lifestyle now",
    author: "João Gaspar",
    role: "Founder @ FinBird",
    avatar: "https://surfslot.pt/public/playground_assets/joao-gaspar-testimonial-1-200w.jpeg"
  },
  {
    quote: "I am using surfslot on a daily basis to block my calendar on the right time to go surfing. Thanks guys!",
    author: "José Oliveira",
    role: "FP&A @ EDPR",
    avatar: "https://surfslot.pt/public/playground_assets/joao-gaspar-testimonial-1-200w.jpeg"
  },
  {
    quote: "To the ones that can't miss great sessions and also have important business duties",
    author: "Gil Marques",
    role: "Entrepreneur @ Amy's Camper Vans",
    avatar: "https://surfslot.pt/public/playground_assets/joao-gaspar-testimonial-1-200w.jpeg"
  }
]

export function TestimonialSlider() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrent((current + newDirection + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1)
    }, 5000)
    return () => clearInterval(timer)
  }, [current])

  return (
    <div className="relative overflow-hidden w-full max-w-4xl mx-auto px-4">
      <div className="relative h-[300px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1)
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1)
              }
            }}
            className="absolute w-full"
          >
            <div className="flex flex-col items-center text-center">
              <blockquote className="text-2xl md:text-3xl font-medium italic mb-8">
                {testimonials[current].quote}
              </blockquote>
              <div className="flex items-center gap-4">
                <Image
                  src={testimonials[current].avatar}
                  alt={`${testimonials[current].author} avatar`}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                <div className="text-left">
                  <div className="font-semibold">{testimonials[current].author}</div>
                  <div className="text-sm text-gray-600">{testimonials[current].role}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2"
        onClick={() => paginate(-1)}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2"
        onClick={() => paginate(1)}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      <div className="flex justify-center gap-2 mt-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1)
              setCurrent(index)
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === current ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

