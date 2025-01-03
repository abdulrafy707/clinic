'use client'

import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { MicrophoneIcon, StopIcon, ArrowUpTrayIcon, HomeIcon, DocumentTextIcon, UserIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, PlusIcon } from '@heroicons/react/24/outline'


export default function DashboardOld() {
  const [result, setResult] = useState(null)
  const [recording, setRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioChunks, setAudioChunks] = useState([])
  const [uploadedFile, setUploadedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [patientName, setPatientName] = useState('')
  const [patientAddress, setPatientAddress] = useState('')
  const [templates, setTemplates] = useState([])
  const audioRef = useRef(null)

  const doctorId = '1'
  const selectedTemplateId = '1'

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`/api/templates?doctorId=${doctorId}`)
        const data = await response.json()

        if (response.ok) {
          setTemplates(data.templates)
        } else {
          setError(data.error || 'Failed to fetch templates.')
        }
      } catch (error) {
        console.error('Error fetching templates:', error)
        setError('Failed to fetch templates.')
      }
    }

    fetchTemplates()
  }, [])

  const handleStartRecording = async () => {
    setError(null)
    setUploadedFile(null)

    if (!doctorId || !selectedTemplateId) {
      setError('Doctor ID or template ID is missing.')
      return
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const media = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
          audioBitsPerSecond: 128000,
        })
        setMediaRecorder(media)
        setAudioChunks([])

        media.start()
        setRecording(true)
        console.log('Recording started.')

        media.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            setAudioChunks((prev) => [...prev, event.data])
            console.log(`Received audio chunk of size: ${event.data.size} bytes`)
          }
        }

        media.onstop = () => {
          stream.getTracks().forEach((track) => track.stop())
          console.log('Recording stopped.')
        }
      } catch (err) {
        console.error('Microphone access denied or error:', err)
        setError('Microphone access denied or error occurred.')
      }
    } else {
      setError('Your browser does not support audio recording.')
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setRecording(false)
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
      setAudioChunks([])
      setError(null)

      const audioUrl = URL.createObjectURL(file)
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        console.log('Audio file selected:', file.name)
      }
    }
  }

  const handleUpload = async () => {
    let audioBlob
    let filename

    if (uploadedFile) {
      audioBlob = uploadedFile
      filename = uploadedFile.name
    } else if (audioChunks.length > 0) {
      audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
      filename = 'recording.webm'
    } else {
      setError('No audio recorded or file uploaded.')
      return
    }

    console.log('Audio Blob size:', audioBlob.size)

    const formData = new FormData()
    formData.append('file', audioBlob, filename)
    formData.append('userId', doctorId)
    formData.append('patientName', patientName || '')
    formData.append('patientAddress', patientAddress || '')
    formData.append('templateId', selectedTemplateId)

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Received transcription length:', data.transcription.length)
        setResult(data)
        console.log('Transcription and formatted output received:', data)
      } else {
        console.error('Error from server:', data)
        setError(data.error || 'Error uploading the audio.')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Something went wrong.')
    } finally {
      setLoading(false)
      setAudioChunks([])
      setUploadedFile(null)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 overflow-y-auto flex justify-center">
        <div className="w-full max-w-3xl px-8 py-12">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">New Transcription</h1>
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="space-y-6 mb-8">
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  id="patientName"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label htmlFor="patientAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Address
                </label>
                <input
                  id="patientAddress"
                  type="text"
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                  placeholder="Enter patient address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload audio file
                </label>
                <div className="flex items-center">
                  <label htmlFor="fileUpload" className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors duration-200">
                    <PlusIcon className="w-5 h-5 inline-block mr-2" />
                    Choose File
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="ml-4 text-sm text-gray-500">
                    {uploadedFile ? uploadedFile.name : 'No file chosen'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {!recording ? (
                  <button
                    onClick={handleStartRecording}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    <MicrophoneIcon className="w-5 h-5 mr-2" />
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    <StopIcon className="w-5 h-5 mr-2" />
                    Stop Recording
                  </button>
                )}
                <span className="text-sm text-gray-500">or record new audio</span>
              </div>
            </div>
            {(audioChunks.length > 0 || uploadedFile) && (
              <div className="mt-8">
                <h3 className="font-semibold mb-4 text-gray-700">Audio Preview:</h3>
                <audio ref={audioRef} controls className="w-full" />
                <button
                  onClick={handleUpload}
                  className="mt-4 flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                  Upload and Transcribe
                </button>
              </div>
            )}
            {loading && <p className="text-blue-600 mt-4">Transcribing...</p>}
            {error && <p className="text-red-600 mt-4">Error: {error}</p>}
            {result && (
              <div className="mt-8 space-y-8">
                <div>
                  <h3 className="font-semibold mb-4 text-gray-700">Transcription:</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-800 whitespace-pre-wrap">{result.transcription}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-gray-700">Formatted Output:</h3>
                  <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-md">
                    <ReactMarkdown>{result.formattedOutput}</ReactMarkdown>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4 text-gray-700">Subjective:</h3>
                    <p className="text-gray-800">{result.subjective}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4 text-gray-700">Objective:</h3>
                    <ul className="list-disc pl-5 text-gray-800">
                      {Object.entries(result.objective).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-gray-700">Assessment:</h3>
                  <p className="text-gray-800">{result.assessment}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-gray-700">Plan:</h3>
                  <p className="text-gray-800">{result.plan}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}