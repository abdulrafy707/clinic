import { Mic, Square, ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <main className="relative">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
              The World&apos;s First
              <br />
              AI Veterinary
              <br />
              SOAPs.
            </h1>
            <p className="mb-8 text-xl text-gray-600">
              With Scribe, you can get your veterinary notes done in just two clicks.
            </p>
            <div className="space-y-4">
              <button className="rounded-full bg-indigo-600 px-8 py-3 text-lg font-semibold text-white hover:bg-indigo-700">
                Try Scribe
              </button>
              <p className="text-sm text-gray-500">Free to try. No credit card required.</p>
            </div>
          </div>
          <div className="hidden md:block">
            {/* Placeholder for hero image */}
            <div className="h-full w-full rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Step 1 */}
          <div className="relative flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">Click.</h3>
            <div className="mb-4 rounded-full bg-indigo-100 p-4">
              <Mic className="h-8 w-8 text-indigo-600" />
            </div>
            <ArrowRight className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 text-indigo-600 md:block" />
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">Talk.</h3>
            <div className="relative h-32 w-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=128&width=200"
                  alt="Veterinarian with patient"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <ArrowRight className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 text-indigo-600 md:block" />
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">Click.</h3>
            <div className="mb-4 rounded-full bg-indigo-100 p-4">
              <Square className="h-8 w-8 text-indigo-600" />
            </div>
            <ArrowRight className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 text-indigo-600 md:block" />
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">Review.</h3>
            <div className="w-full space-y-2 rounded-lg bg-gray-100 p-4">
              <div className="h-4 w-full rounded bg-indigo-200" />
              <div className="h-4 w-3/4 rounded bg-indigo-200" />
              <div className="h-4 w-1/2 rounded bg-indigo-200" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}