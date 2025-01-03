'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EditRecordPage() {
  const { id } = useParams()
  const router = useRouter()
  const [recording, setRecording] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [attachedFile, setAttachedFile] = useState(null) // New state variable for attached file

  useEffect(() => {
    const fetchRecording = async () => {
      try {
        const response = await fetch(`/api/uploads/${id}`)
        const data = await response.json()
        if (response.ok) {
          // Parse objective if it's a JSON string
          if (data.objective && typeof data.objective === 'string') {
            data.objective = JSON.parse(data.objective)
          }
          setRecording(data)
        } else {
          setError(data.error || 'Failed to fetch transcription.')
        }
      } catch (error) {
        console.error('Error fetching transcription:', error)
        setError('Failed to fetch transcription.')
      }
    }

    if (id) {
      fetchRecording()
    }
  }, [id])

  const handleUpdateRecording = async () => {
    if (!recording) return;
  
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('note_title', recording.note_title || '');
      formData.append('subjective', recording.subjective || '');
      formData.append('assessment', recording.assessment || '');
      formData.append('plan', recording.plan || '');
      formData.append('additional_note', recording.additional_note || '');
  
      // If objective is an object, stringify it
      if (recording.objective && typeof recording.objective === 'object') {
        formData.append('objective', JSON.stringify(recording.objective));
      } else if (recording.objective) {
        formData.append('objective', recording.objective);
      }
  
      // Append the attached file if a new file is selected
      if (attachedFile) {
        formData.append('attached_file', attachedFile);
      } else if (recording.attached_file) {
        // Include existing attached file URL if no new file is selected
        formData.append('attached_file_url', recording.attached_file);
      }
  
      const response = await fetch(`/api/uploads/${id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Transcription updated:', data);
        router.push('/dashboard');
      } else {
        console.error('Error updating transcription:', data);
        setError(data.error || 'Failed to update transcription.');
      }
    } catch (error) {
      console.error('Error updating transcription:', error);
      setError('Failed to update transcription.');
    } finally {
      setLoading(false);
    }
  };
  

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!recording) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Edit SOAP Note</h2>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-500 hover:text-gray-700"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Editable form for the SOAP note sections */}
          <div className="space-y-6">
            <div>
              <label className="font-semibold mb-2 text-gray-900">Note Title</label>
              <input
                type="text"
                value={recording.note_title || ''}
                onChange={(e) => setRecording({ ...recording, note_title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold mb-2 text-gray-900">Subjective</label>
              <textarea
                value={recording.subjective || ''}
                onChange={(e) => setRecording({ ...recording, subjective: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={4}
              />
            </div>

            <div>
              <label className="font-semibold mb-2 text-gray-900">Objective</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                {recording.objective ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {Object.entries(recording.objective).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => {
                            const updatedObjective = { ...recording.objective, [key]: e.target.value }
                            setRecording({ ...recording, objective: updatedObjective })
                          }}
                          className="ml-2 px-2 py-1 border border-gray-200 rounded-lg"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-800">No objective data available.</p>
                )}
              </div>
            </div>

            <div>
              <label className="font-semibold mb-2 text-gray-900">Assessment</label>
              <textarea
                value={recording.assessment || ''}
                onChange={(e) => setRecording({ ...recording, assessment: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={4}
              />
            </div>

            <div>
              <label className="font-semibold mb-2 text-gray-900">Plan</label>
              <textarea
                value={recording.plan || ''}
                onChange={(e) => setRecording({ ...recording, plan: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={4}
              />
            </div>

            <div>
              <label className="font-semibold mb-2 text-gray-900">Additional Note</label>
              <textarea
                value={recording.additional_note || ''}
                onChange={(e) => setRecording({ ...recording, additional_note: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={4}
              />
            </div>

            {/* New field for attached file */}
            <div>
              <label className="font-semibold mb-2 text-gray-900">Attached File</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" // Adjust accepted file types as needed
                onChange={(e) => setAttachedFile(e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
              {recording.attached_file && !attachedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Current attached file: <a href={recording.attached_file} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">View File</a>
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUpdateRecording}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
