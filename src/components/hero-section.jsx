import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <div
      className="relative min-h-screen"
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
      <Container className="relative z-10">
        <div className="flex flex-col items-center justify-center min-h-screen max-w-4xl mx-auto text-center pt-40 pb-32">
          <div className="space-y-6 mb-8">
            <h1 className="font-plus text-[2.75rem] sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900">
              Save hours every day
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Automatic SOAP notes.
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto mt-6">
              Reclaim your time. Scriba listens, transcribes, and writes medical
              documentation for you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-sm font-normal h-12 px-8"
            >
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto text-sm font-normal h-12 px-8"
            >
              <Link href="/demo">Request Demo</Link>
            </Button>
          </div>

          <div className="relative w-full max-w-5xl mx-auto">
            <div className="absolute inset-0 -rotate-1 rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-200 shadow-2xl"></div>
            <div className="absolute inset-0 rotate-1 rounded-2xl bg-gradient-to-tr from-blue-50 to-blue-100 shadow-2xl"></div>
            <Image
              src="/dashboard-screenshot.png"
              alt="Scriba Dashboard"
              width={1200}
              height={675}
              className="relative rounded-2xl shadow-2xl border border-gray-200/50"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
