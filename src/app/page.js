'use client';
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [result, setResult] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [templates, setTemplates] = useState([]);
  const audioRef = useRef(null);

  // Predefined doctorId and templateId for testing
  const doctorId = '1';
  const selectedTemplateId = '2';

  // Fetch templates for the doctor on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`/api/templates?doctorId=${doctorId}`);
        const data = await response.json();

        if (response.ok) {
          setTemplates(data.templates);
        } else {
          setError(data.error || 'Failed to fetch templates.');
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
        setError('Failed to fetch templates.');
      }
    };

    fetchTemplates();
  }, []);

  // Function to start recording
  const handleStartRecording = async () => {
    setError(null);
    setUploadedFile(null);

    if (!doctorId || !selectedTemplateId) {
      setError('Doctor ID or template ID is missing.');
      return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const media = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
          audioBitsPerSecond: 128000,
        });
        setMediaRecorder(media);
        setAudioChunks([]);

        media.start();
        setRecording(true);
        console.log('Recording started.');

        media.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            setAudioChunks((prev) => [...prev, event.data]);
            console.log(`Received audio chunk of size: ${event.data.size} bytes`);
          }
        };

        media.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
          console.log('Recording stopped.');
        };
      } catch (err) {
        console.error('Microphone access denied or error:', err);
        setError('Microphone access denied or error occurred.');
      }
    } else {
      setError('Your browser does not support audio recording.');
    }
  };

  // Function to stop recording
  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setAudioChunks([]);
      setError(null);

      const audioUrl = URL.createObjectURL(file);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        console.log('Audio file selected:', file.name);
      }
    }
  };

  // Function to upload audio
  const handleUpload = async () => {
    let audioBlob;
    let filename;

    if (uploadedFile) {
      audioBlob = uploadedFile;
      filename = uploadedFile.name;
    } else if (audioChunks.length > 0) {
      audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      filename = 'recording.webm';
    } else {
      setError('No audio recorded or file uploaded.');
      return;
    }

    console.log('Audio Blob size:', audioBlob.size);

    const formData = new FormData();
    formData.append('file', audioBlob, filename);
    formData.append('userId', doctorId); // Use predefined doctorId
    formData.append('patientName', patientName || '');
    formData.append('patientAddress', patientAddress || '');
    formData.append('templateId', selectedTemplateId); // Use predefined templateId

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Received transcription length:', data.transcription.length);
        setResult(data);
        console.log('Transcription and formatted output received:', data);
      } else {
        console.error('Error from server:', data);
        setError(data.error || 'Error uploading the audio.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Something went wrong.');
    } finally {
      setLoading(false);
      setAudioChunks([]);
      setUploadedFile(null);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Record or Upload Audio for Transcription</h1>

      <div className="mb-4">
        <label className="block mb-2">Patient Name (Optional)</label>
        <input
          type="text"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Enter patient name"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Patient Address (Optional)</label>
        <input
          type="text"
          value={patientAddress}
          onChange={(e) => setPatientAddress(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Enter patient address"
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Choose an option:</h2>
        <div className="flex items-center mb-2">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="mr-2"
          />
          <span className="text-gray-600">Upload audio file from device</span>
        </div>
        <div className="flex items-center">
          {!recording ? (
            <button
              onClick={handleStartRecording}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
              Stop Recording
            </button>
          )}
          <span className="text-gray-600">or Record new audio</span>
        </div>
      </div>

      {(audioChunks.length > 0 || uploadedFile) && (
        <div className="mt-4">
          <h3 className="font-semibold">Audio Preview:</h3>
          <audio ref={audioRef} controls />
          <button
            onClick={handleUpload}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            Upload and Transcribe
          </button>
        </div>
      )}

      {loading && <p className="text-blue-600">Transcribing...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {result && (
        <div>
          <h3 className="mt-4 font-semibold">Transcription:</h3>
          <textarea
            value={result.transcription}
            readOnly
            rows={10}
            className="w-full border p-2 rounded"
          />

          <h3 className="mt-4 font-semibold">Formatted Output:</h3>
          <div className="prose prose-lg">
            <ReactMarkdown>{result.formattedOutput}</ReactMarkdown>
          </div>

          <h3 className="mt-4 font-semibold">Subjective:</h3>
          <p>{result.subjective}</p>

          <h3 className="mt-4 font-semibold">Objective:</h3>
          <ul>
            {Object.entries(result.objective).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>

          <h3 className="mt-4 font-semibold">Assessment:</h3>
          <p>{result.assessment}</p>

          <h3 className="mt-4 font-semibold">Plan:</h3>
          <p>{result.plan}</p>
        </div>
      )}
    </div>
  );
}
