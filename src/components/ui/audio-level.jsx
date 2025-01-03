"use client"

import { useEffect, useRef } from 'react'

export function AudioLevel({ isRecording }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const analyserRef = useRef(null)
  const dataArrayRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    let audioContext
    let analyser
    let microphone

    async function setupAudioContext() {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)()
        analyser = audioContext.createAnalyser()
        analyserRef.current = analyser
        analyser.fftSize = 32
        const bufferLength = analyser.frequencyBinCount
        dataArrayRef.current = new Uint8Array(bufferLength)

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream
        microphone = audioContext.createMediaStreamSource(stream)
        microphone.connect(analyser)

        drawLevels()
      } catch (error) {
        console.error('Error setting up audio context:', error)
      }
    }

    function drawLevels() {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const width = canvas.width
      const height = canvas.height
      const barWidth = 3
      const barGap = 2
      const bars = 8

      function draw() {
        animationRef.current = requestAnimationFrame(draw)
        analyserRef.current.getByteFrequencyData(dataArrayRef.current)

        ctx.clearRect(0, 0, width, height)
        
        for (let i = 0; i < bars; i++) {
          const value = dataArrayRef.current[i]
          const percent = value / 255
          const barHeight = height * percent

          // Use a gradient from primary color to muted
          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight)
          gradient.addColorStop(0, '#22c55e')  // Green-500
          gradient.addColorStop(1, 'rgba(34, 197, 94, 0.5)')  // Green-500 with 50% opacity
          
          ctx.fillStyle = gradient
          ctx.fillRect(
            i * (barWidth + barGap),
            height - barHeight,
            barWidth,
            barHeight
          )
        }
      }

      draw()
    }

    setupAudioContext()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={40}
      height={20}
      className="opacity-70"
    />
  )
}

