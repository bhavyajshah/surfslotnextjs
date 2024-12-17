'use client'

import { useEffect, useState } from 'react'
import Image from "next/image"
import { Calendar, Users, BarChart3, Smartphone, Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { WhatsAppButton } from './whatsapp-button'
import { TestimonialSlider } from './testimonial-slider'

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function SurfslotLanding() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
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
              <Button className="bg-[#B3E6E5] text-black hover:bg-[#93d6d5]">Sign Up</Button>
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
                  <Button className="bg-[#B3E6E5] text-black hover:bg-[#93d6d5] w-full">Sign Up</Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 px-6 pb-16 lg:py-24">
        <motion.div
          className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <div>
            <motion.h1
              className="text-4xl lg:text-6xl font-bold leading-tight"
              variants={fadeInUp}
            >
              do not loose that surf session in{" "}
              <span className="text-blue-600">ericeira</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-gray-600 max-w-md"
              variants={fadeInUp}
            >
              Surfslot is your scheduling automation platform for monitoring
              the great days of surf that you have been missing because of meetings
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button className="mt-8 bg-black text-white hover:bg-gray-800">
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
          </div>
          <motion.div
            className="relative aspect-[4/3]"
            variants={fadeInUp}
          >
            <Image
              src="https://surfslot.pt/public/playground_assets/1-png-aef2a3%20%5B1%5D-1200w.jpg"
              alt="Surfing scene"
              fill
              className="object-cover rounded-lg"
            />
          </motion.div>
        </motion.div>
      </section>


      {/* Calendar Demo Section */}
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

      {/* Stats Section */}
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

      {/* Features Section */}
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

      {/* Pricing Section */}
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
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    surfslots populated into your Google Calendar
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
                    Specify your availability
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
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Adjust your forecasts
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Rename the events on your employee calendar
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

      {/* Testimonial Section */}
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

      {/* FAQ Section */}
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
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I customize the app's settings?</h3>
              <p className="text-gray-600">
                Yes, the app allows you to customize its settings according to your preferences. You can choose to receive notifications when a time slot is blocked or when a new surfing forecast becomes available. You can also override the app's blocking feature if you need to attend a meeting during a good surfing time. In the near future you will be able to customise your skill and the periods when you prefer to surf.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Where does the app get its surfing forecast information from?</h3>
              <p className="text-gray-600">
                The app sources its surfing forecast information from reputable surfing websites and updates it regularly to ensure accuracy.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Does the app only work in certain locations?</h3>
              <p className="text-gray-600">
                The app uses the user's location to look for nearby surfing spots or allows the user to customize them. Although, at this point just some locations are available (mainly in Portugal)
              </p>
            </div>
          </div>
        </motion.div>
      </section>


      {/* Get Started CTA */}
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
          <Button className="bg-black text-white hover:bg-gray-800">
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

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">surfslot</h3>
              <p className="text-gray-400">
                Your scheduling automation platform for monitoring the great days of surf
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integration</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400">© 2024 surfslot. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  )
}

