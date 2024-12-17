'use client'
import Link from 'next/link'
import { BsWhatsapp } from 'react-icons/bs'

export function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/919504155?text=Hi%20Ruben!%20I%20want%20to%20chat%20about%20surfslot!"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600"
    >
      <BsWhatsapp className="h-6 w-6" />
      <span className="sr-only">Contact us on WhatsApp</span>
    </Link>
  )
}

