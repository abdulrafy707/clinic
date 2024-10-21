'use client';
import React, { useState, useRef } from 'react';

export default function Home() {
  const [result, setResult] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null); // Added state for uploaded file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(''); // Field for user ID
  const [patientName, setPatientName] = useState(''); // Field for patient name
  const [patientAddress, setPatientAddress] = useState(''); // Field for patient address
  const audioRef = useRef(null); // Reference to the audio element for playback

  // Function to start recording
  const handleStartRecording = async () => {
    setError(null);
    setUploadedFile(null); // Clear any uploaded file when recording starts

    if (!userId) {
      setError('Please enter your User ID before recording.');
      return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const media = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
          audioBitsPerSecond: 128000, // Higher bitrate for better quality
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

  // Function to handle file upload from device
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setAudioChunks([]); // Clear any existing recorded audio
      setError(null);

      // For playback (optional)
      const audioUrl = URL.createObjectURL(file);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        console.log('Audio file selected:', file.name);
      }
    }
  };

  // Function to upload the recorded audio or uploaded file
  const handleUpload = async () => {
    let audioBlob;
    let filename;

    if (uploadedFile) {
      // If a file has been uploaded from the device
      audioBlob = uploadedFile;
      filename = uploadedFile.name;
    } else if (audioChunks.length > 0) {
      // If audio has been recorded
      audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      filename = 'recording.webm';
    } else {
      setError('No audio recorded or file uploaded.');
      return;
    }

    console.log('Audio Blob size:', audioBlob.size);

    const formData = new FormData();
    formData.append('file', audioBlob, filename);
    formData.append('userId', userId);
    formData.append('patientName', patientName || '');
    formData.append('patientAddress', patientAddress || '');

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
        console.log('Transcription and summary received:', data);
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
        <label className="block mb-2">User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Enter user ID"
        />
      </div>

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

      {/* Options to record or upload */}
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

          <h3 className="mt-4 font-semibold">Summary:</h3>
          <p>{result.summary}</p>
        </div>
      )}
    </div>
  );
}
