// src/components/dashboard.jsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, Upload, Clock, ChevronRight, Search, Loader2, Plus, HardDrive, FileAudio, BarChart3, Files } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export default function Dashboard() {
  const [result, setResult] = useState(null)
  const [recording, setRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioChunks, setAudioChunks] = useState([])
  const [uploadedFile, setUploadedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [patientName, setPatientName] = useState('')
  const [patientAddress, setPatientAddress] = useState('')
  const [recordingHistory, setRecordingHistory] = useState([])
  const audioRef = useRef(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [doctorId, setDoctorId] = useState(null)
  const [adminTemplates, setAdminTemplates] = useState([])
  const [userTemplates, setUserTemplates] = useState([])
  const [templates, setTemplates] = useState([])
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)
  const [noteTitle, setNoteTitle] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const router = useRouter()

  useEffect(() => {
    const storedDoctorId = localStorage.getItem('userId')
    if (storedDoctorId) {
      setDoctorId(storedDoctorId)
    } else {
      setError('Doctor ID not found in local storage.')
    }
  }, [])

  useEffect(() => {
    const fetchAdminTemplates = async () => {
      try {
        const response = await fetch('/api/objective-tempelates')
        const data = await response.json()

        if (response.ok && data.templates.length > 0) {
          setAdminTemplates(data.templates)
        } else {
          setError('No admin templates available.')
        }
      } catch (error) {
        console.error('Error fetching admin templates:', error)
        setError('Failed to fetch admin templates.')
      }
    }

    fetchAdminTemplates()
  }, [])

  useEffect(() => {
    if (doctorId) {
      const fetchUserTemplates = async () => {
        try {
          const response = await fetch(`/api/templates?doctorId=${doctorId}`)
          const data = await response.json()

          if (response.ok && data.templates.length > 0) {
            setUserTemplates(data.templates)
          } else {
            console.log('No user templates found.')
          }
        } catch (error) {
          console.error('Error fetching user templates:', error)
          setError('Failed to fetch user templates.')
        }
      }

      fetchUserTemplates()
    }
  }, [doctorId])

  useEffect(() => {
    const combinedTemplates = [...adminTemplates, ...userTemplates]
    setTemplates(combinedTemplates)

    if (adminTemplates.length > 0 && !selectedTemplateId) {
      setSelectedTemplateId(adminTemplates[0].id)
    }
  }, [adminTemplates, userTemplates])

  useEffect(() => {
    if (doctorId) {
      const fetchTranscriptions = async () => {
        try {
          const response = await fetch(`/api/transcription?userId=${doctorId}`)
          const data = await response.json()

          if (response.ok) {
            setRecordingHistory(data.transcriptions)
          } else {
            setError(data.error || 'Failed to fetch transcriptions.')
          }
        } catch (error) {
          console.error('Error fetching transcriptions:', error)
          setError('Failed to fetch transcriptions.')
        }
      }

      fetchTranscriptions()
    }
  }, [doctorId])

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

        media.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            setAudioChunks((prev) => [...prev, event.data])
          }
        }

        media.onstop = () => {
          stream.getTracks().forEach((track) => track.stop())
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

    const formData = new FormData()
    formData.append('file', audioBlob, filename)
    formData.append('userId', doctorId)
    formData.append('patientName', patientName || '')
    formData.append('patientAddress', patientAddress || '')
    formData.append('templateId', selectedTemplateId)
    formData.append('noteTitle', noteTitle || '')

    setLoading(true)
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        if (doctorId) {
          fetch(`/api/transcription?userId=${doctorId}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.transcriptions) {
                setRecordingHistory(data.transcriptions)
              }
            })
        }
      } else {
        console.error('Error from server:', data)
        setError(data.error || 'Error uploading the audio.')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Something went wrong.')
    } finally {
      setLoading(false)
      setIsGenerating(false)
      setAudioChunks([])
      setUploadedFile(null)
      setNoteTitle('')
    }
  }

  const handleSelectRecording = (recording) => {
    router.push(`/edit_record/${recording.id}`)
  }

  const filteredRecordings = recordingHistory.filter((recording) => {
    const title = recording.note_title || 'Untitled Note'
    return title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Welcome back, Dr. Smith</h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Used Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2 GB</div>
            <Progress value={65} className="mt-4 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              65% of available storage used
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recordings</CardTitle>
            <FileAudio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordingHistory.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              +12 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {userTemplates.length} custom templates
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24%</div>
            <p className="text-xs text-muted-foreground mt-2">
              +8 recordings this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Create Recording</CardTitle>
            <CardDescription>
              Record a new session or upload an audio file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="noteTitle">Note Title</Label>
                <Input
                  id="noteTitle"
                  placeholder="Enter note title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                  <SelectTrigger id="template" className="h-9">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col items-center py-8">
              <AnimatePresence mode="wait">
                {!recording ? (
                  <motion.button
                    onClick={handleStartRecording}
                    className="w-32 h-32 rounded-full bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mic className="w-12 h-12" />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleStopRecording}
                    className="w-32 h-32 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Square className="w-12 h-12" />
                  </motion.button>
                )}
              </AnimatePresence>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                {recording ? 'Recording in progress...' : 'Click to start recording'}
              </p>
            </div>

            {(audioChunks.length > 0 || uploadedFile) && (
              <div className="space-y-4">
                <audio ref={audioRef} controls className="w-full" />
                <Button
                  onClick={handleUpload}
                  disabled={isGenerating}
                  className="w-full h-9"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Generate SOAP Note
                    </>
                  )}
                </Button>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Recordings</CardTitle>
              <CardDescription>
                View and manage your recent sessions
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleStartRecording}>
              <Plus className="mr-2 h-4 w-4" />
              New Recording
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search recordings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredRecordings.length === 0 ? (
                <p className="text-center text-muted-foreground">No recordings found</p>
              ) : (
                filteredRecordings.map((recording) => (
                  <Button
                    key={recording.id}
                    variant="ghost"
                    className="w-full justify-between hover:bg-muted/50"
                    onClick={() => handleSelectRecording(recording)}
                  >
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span className="truncate">{recording.note_title || 'Untitled Note'}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  </Button>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">SOAP Note</h2>
                  <Button variant="ghost" onClick={() => setResult(null)}>
                    Close
                  </Button>
                </div>

                {['Subjective', 'Objective', 'Assessment', 'Plan', 'Additional Note'].map((section) => (
                  <div key={section}>
                    <h3 className="text-lg font-semibold">{section}</h3>
                    <div className="bg-muted p-4 rounded-md">
                      {section === 'Objective' ? (
                        <ul className="list-disc pl-5 space-y-2">
                          {Object.entries(result[section.toLowerCase()]).map(([key, value]) => (
                            <li key={key}>
                              <strong>{key}:</strong> {value}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>{result[section.toLowerCase()]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

