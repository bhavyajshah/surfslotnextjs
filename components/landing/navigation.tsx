'use client'

import Image from "next/image"
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavigationProps {
  isScrolled: boolean
  onSignIn: () => void
}

export function Navigation({ isScrolled, onSignIn }: NavigationProps) {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-bold">surfslot</div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
            <a href="#how" className="text-sm hover:text-primary transition-colors">How it works</a>
            <a href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</a>
            <a href="#contact" className="text-sm hover:text-primary transition-colors">Contact</a>
            <Button
              onClick={onSignIn}
              className="bg-[#B3E6E5] text-black hover:bg-[#93d6d5]"
            >
              Sign Up
            </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-lg hover:text-primary transition-colors">Features</a>
                <a href="#how" className="text-lg hover:text-primary transition-colors">How it works</a>
                <a href="#pricing" className="text-lg hover:text-primary transition-colors">Pricing</a>
                <a href="#contact" className="text-lg hover:text-primary transition-colors">Contact</a>
                <Button
                  onClick={onSignIn}
                  className="bg-[#B3E6E5] text-black hover:bg-[#93d6d5] w-full"
                >
                  Sign Up
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}