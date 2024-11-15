'use client'
import { useState } from 'react'

export default function StatsAndFeatures() {
  const [selectedView, setSelectedView] = useState('team')

  return (
    <div className="bg-gray-50 py-24">
      {/* Stats Section */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Trusted by veterinarians.</h2>
          <p className="mb-12 text-lg text-gray-600">
            Used and loved by hundreds of veterinary care teams every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Clinics */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="text-4xl font-bold text-indigo-600 md:text-5xl">500+</div>
            <div className="mt-2 text-gray-600">Clinics</div>
          </div>

          {/* Veterinarians */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="text-4xl font-bold text-indigo-600 md:text-5xl">1000+</div>
            <div className="mt-2 text-gray-600">Veterinarians</div>
          </div>

          {/* Notes Created */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="text-4xl font-bold text-indigo-600 md:text-5xl">1.5M+</div>
            <div className="mt-2 text-gray-600">Notes Created</div>
          </div>
        </div>
      </div>

      {/* Time Savings Section */}
      <div className="mx-auto max-w-7xl px-4 pt-24">
        <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-lg md:p-12">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              {/* Toggle Buttons */}
              <div className="mb-8 inline-flex rounded-full bg-gray-100 p-1">
                <button
                  className={`rounded-full px-6 py-2 transition-colors ${selectedView === 'solo'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                  onClick={() => setSelectedView('solo')}
                >
                  Solo
                </button>
                <button
                  className={`rounded-full px-6 py-2 transition-colors ${selectedView === 'team'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                  onClick={() => setSelectedView('team')}
                >
                  Team
                </button>
              </div>

              <h2 className="mb-6 text-4xl font-bold text-gray-900">
                Time savings for {selectedView === 'solo' ? 'solo practitioners' : 'everyone'}.
              </h2>
              <p className="text-lg text-gray-600">
                {selectedView === 'solo'
                  ? "As a solo practitioner, Scribenote streamlines your workflow, allowing you to focus more on patient care and less on paperwork."
                  : "Whether you're a solo practitioner or a care team member, Scribenote has workflows that work for you."}
              </p>
            </div>

            {/* Illustration */}
            <div className="relative">
              <div className="relative h-64 w-full md:h-full">
                <img
                  src={selectedView === 'solo'
                    ? "/placeholder.svg?height=400&width=600&text=Solo+Practitioner"
                    : "/placeholder.svg?height=400&width=600&text=Veterinary+Team"}
                  alt={selectedView === 'solo' ? "Solo veterinarian" : "Veterinarians collaborating"}
                  className="h-full w-full object-contain"
                />
                {/* Clinic Building Overlay */}
                <div className="absolute right-0 top-0 h-32 w-32">
                  <div className="h-full w-full rounded-lg bg-indigo-600 p-4">
                    <div className="h-1/2 w-1/3 bg-white"></div>
                    <div className="mt-2 h-1/3 w-full bg-white/30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}