'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const steps = [
  { title: 'Account', fields: ['name', 'email', 'password'] },
  { title: 'Personal', fields: ['phone'] },
  { title: 'Clinic', fields: ['address', 'city', 'state'] },
]

export default function SignupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    address: '',
    role: 'DOCTOR',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Account created successfully!')
        router.push('/login')
      } else {
        setMessage(data.error || 'Failed to create account.')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
      console.error('Error submitting signup form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const currentFields = steps[currentStep].fields

  return (
    <div className="min-h-screen bg-[#F8F9FF] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-[420px] space-y-6">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-[#EEF1FF] flex items-center justify-center">
          <span className="text-xl font-bold">N</span>
        </div>

        <div className="rounded-[26px] bg-[#f5f5f5] p-1.5">
          <Card className="rounded-[20px] shadow-lg">
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold">
                  Create an account
                </h1>
                <p className="text-base text-gray-500">
                  Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
                </p>
              </div>

              <div className="flex justify-between mb-4">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className={`w-1/3 h-1 rounded ${index <= currentStep ? 'bg-black' : 'bg-gray-200'
                      }`}
                  />
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {currentFields.includes('name') && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-600">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Dr. Jane Smith"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-12 border-gray-200"
                      required
                    />
                  </div>
                )}

                {currentFields.includes('email') && (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-600">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane@clinic.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-12 border-gray-200"
                      required
                    />
                  </div>
                )}

                {currentFields.includes('password') && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-600">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="h-12 border-gray-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {currentFields.includes('phone') && (
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-600">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(555) 555-5555"
                      value={formData.phone}
                      onChange={handleChange}
                      className="h-12 border-gray-200"
                      required
                    />
                  </div>
                )}

                {currentFields.includes('address') && (
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-600">
                      Clinic Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="123 Medical Center Dr"
                      value={formData.address}
                      onChange={handleChange}
                      className="h-12 border-gray-200"
                      required
                    />
                  </div>
                )}

                {currentFields.includes('city') && (
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-gray-600">
                      City
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="San Francisco"
                      value={formData.city}
                      onChange={handleChange}
                      className="h-12 border-gray-200"
                      required
                    />
                  </div>
                )}

                {currentFields.includes('state') && (
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-gray-600">
                      State
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      placeholder="California"
                      value={formData.state}
                      onChange={handleChange}
                      className="h-12 border-gray-200"
                      required
                    />
                  </div>
                )}

                {message && (
                  <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </p>
                )}

                <div className="flex justify-between gap-4">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="h-12 flex-1 bg-gray-200 text-black hover:bg-gray-300"
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="h-12 flex-1 bg-black font-medium text-white hover:bg-black/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </span>
                    ) : currentStep === steps.length - 1 ? (
                      'Create Account'
                    ) : (
                      'Next'
                    )}
                  </Button>
                </div>
              </form>
              <div className="py-1.5 text-center text-[14px]">
                <span className="text-gray-500">
                  By signing up, you agree to our{' '}
                </span>
                <Link
                  href="/terms"
                  className="font-semibold text-black hover:underline"
                >
                  Terms of Service
                </Link>
                <span className="text-gray-500"> and </span>
                <Link
                  href="/privacy"
                  className="font-semibold text-black hover:underline"
                >
                  Privacy Policy
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="py-1.5 text-center text-[15px]">
            <span className="text-gray-500">
              Already have an account?{' '}
            </span>
            <Link
              href="/login"
              className="font-semibold text-black hover:underline"
            >
              Log in
            </Link>
          </div>


        </div>
      </div>
    </div>
  )
}

