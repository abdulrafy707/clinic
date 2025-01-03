import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export function CtaSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <Container>
        <div className="relative mx-auto max-w-[1100px]">
          <div 
            className="relative rounded-[32px] overflow-hidden"
            style={{
              background: `
                linear-gradient(
                  120deg,
                  rgb(255, 228, 230, 0.7) 0%,
                  rgb(204, 251, 241, 0.7) 50%,
                  rgb(255, 237, 213, 0.7) 100%
                )
              `,
            }}
          >
            {/* Dot pattern overlay */}
            <div 
              className="absolute inset-0 opacity-75"
              style={{
                backgroundImage: `
                  radial-gradient(circle at center, #246BFD 0, #246BFD 1.5px, transparent 1.5px)
                `,
                backgroundSize: '24px 24px',
                maskImage: 'linear-gradient(to bottom, rgba(37, 160, 246, 0.08), transparent)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(37, 160, 246, 0.08), transparent)'
              }}
            />

            {/* Content */}
            <div className="relative px-6 py-16 sm:px-12 sm:py-20 text-center">
              <div className="space-y-6">
                <span className="ticker">
                  Try Scriba Today
                </span>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                  Revolutionize Your SOAP Notes
                </h2>
                
                <p className="text-lg text-gray-600 max-w-xl mx-auto">
                  Don't waste hours on documentation.
                  <br className="hidden sm:inline" />
                  Let Scriba streamline your workflow for free.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <Button 
                    asChild
                    size="lg"
                  >
                    <Link href="/signup">
                      Start Free Trial
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                  >
                    <Link href="/demo">
                      Request Demo
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

