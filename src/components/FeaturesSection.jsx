export default function FeaturesSection() {
  return (
    <div className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Feature 1: Seamless SOAPs */}
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <div className="max-w-lg">
              <h2 className="text-4xl font-bold text-gray-900">
                Seamless SOAPs from anywhere.
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Start a note on your phone, and you can add to it later from your laptop or any device logged into your account. Bad internet connection? You can always create an offline recording and sync it later.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-[400px] w-full">
              {/* Phone Device */}
              <div className="absolute left-0 top-0 w-1/2">
                <div className="rounded-3xl bg-gray-100 p-4">
                  <div className="aspect-[9/16] rounded-2xl bg-white p-2">
                    <div className="flex h-full flex-col items-center justify-center rounded-xl bg-indigo-600 p-4">
                      <div className="h-16 w-16 rounded-full bg-white"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Laptop Device */}
              <div className="absolute bottom-0 right-0 w-2/3">
                <div className="rounded-t-xl bg-gray-800 p-2">
                  <div className="aspect-video rounded-lg bg-white"></div>
                </div>
              </div>
              {/* Arrow */}
              <div className="absolute right-1/3 top-1/4 text-indigo-600">
                <svg className="h-12 w-12 rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Set it and forget it */}
        <div className="mt-32 grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div className="order-2 md:order-1">
            <div className="relative mx-auto max-w-[300px]">
              <div className="rounded-3xl bg-gray-100 p-4">
                <div className="aspect-[9/16] rounded-2xl bg-white p-2">
                  <div className="flex h-full flex-col items-center justify-center rounded-xl bg-indigo-600 p-4">
                    <div className="h-16 w-16 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>
              {/* Audio Waves */}
              <div className="absolute -left-8 top-1/4">
                <div className="space-y-1">
                  {[1,2,3].map((i) => (
                    <div key={i} className="h-4 w-8 rounded-full bg-indigo-600/20"></div>
                  ))}
                </div>
              </div>
              <div className="absolute -right-8 bottom-1/4">
                <div className="space-y-1">
                  {[1,2,3].map((i) => (
                    <div key={i} className="h-4 w-8 rounded-full bg-indigo-600/20"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="max-w-lg">
              <h2 className="text-4xl font-bold text-gray-900">
                Set it and (don&apos;t) forget it.
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Never forget another important detail again. Scribenote runs in the background to capture audio while you focus on your appointment.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 3: Appointment Information */}
        <div className="mt-32 grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <div className="max-w-lg">
              <h2 className="text-4xl font-bold text-gray-900">
                Appointment information all in one place.
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Document every aspect of your patient&apos;s appointment - audio, transcript, SOAP, attachments, client communications - all in one easy-to-read note.
              </p>
            </div>
          </div>
          <div>
            <div className="rounded-xl bg-gray-50 p-6">
              <div className="space-y-4">
                {['Subjective', 'Objective', 'Assessment', 'Plan'].map((section, i) => (
                  <div
                    key={section}
                    className={`rounded-lg p-4 ${
                      ['bg-blue-100', 'bg-pink-100', 'bg-green-100', 'bg-yellow-100'][i]
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">{section}</h3>
                    <div className="mt-2 h-2 w-3/4 rounded bg-gray-300"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature 4: PIMS Integration */}
        <div className="mt-32 grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div className="order-2 md:order-1">
            <div className="rounded-xl bg-gray-900 p-6">
              <div className="space-y-3">
                {['Subjective', 'Objective', 'Assessment', 'Plan'].map((section, i) => (
                  <button
                    key={section}
                    className={`w-full rounded-lg p-3 text-left text-white ${
                      ['bg-blue-500', 'bg-pink-500', 'bg-green-500', 'bg-yellow-500'][i]
                    }`}
                  >
                    Copy {section}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="max-w-lg">
              <h2 className="text-4xl font-bold text-gray-900">
                Works with any PIMS.
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                When you&apos;re done at the end of the day, Scribenote&apos;s desktop widget (aka The Draggy-Droppy), allows you to copy your completed Scribenote records into your PIMS in just seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}