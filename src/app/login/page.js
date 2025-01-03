'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await axios.post(`/api/login`, {
        email,
        password,
      })

      if (response.status === 200) {
        const { token, user } = response.data
        localStorage.setItem('authToken', token)
        localStorage.setItem('userId', user.id)
        setMessage('Login successful')
        router.push('/dashboard')
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

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
                  Welcome back!
                </h1>
                <p className="text-base text-gray-500">
                  Please enter your details to login.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-600">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="youremail@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-gray-200"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-600">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                </div>

                {message && (
                  <p className={`text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </p>
                )}

                <Button
                  type="submit"
                  className="h-12 w-full bg-black font-medium text-white hover:bg-black/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Logging in...
                    </span>
                  ) : (
                    'Login with email'
                  )}
                </Button>

                <div className="text-center text-[15px]">
                  <span className="text-gray-500">
                    Forgot your password?{' '}
                  </span>
                  <Link
                    href="/forgot-password"
                    className="font-semibold text-black hover:underline"
                  >
                    Reset it
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="py-1.5 text-center text-[15px]">
            <span className="text-gray-500">
              Don't have an account?{' '}
            </span>
            <Link
              href="/signup"
              className="font-semibold text-black hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

