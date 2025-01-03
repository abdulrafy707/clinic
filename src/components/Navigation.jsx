'use client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"


export function Navigation() {
  return (
    <nav className={`fixed top-5 left-5 right-5 z-50 transition-all duration-300 max-w-xl mx-auto bg-white w-full rounded-[200px] shadow-[0px_3px_8px_4px_rgba(0,0,0,0.03)] opacity-100 custom-border`}>
      <Container>
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center space-x-10">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-semibold">
                S
              </div>
              <span className="text-lg font-semibold text-gray-900">Scriba</span>
            </Link>
            <div className="px-4 py-2 flex items-center space-x-4">
              <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
            </div>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </Container>
    </nav>
  )
}

