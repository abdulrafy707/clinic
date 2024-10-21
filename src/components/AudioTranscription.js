'use client';
import { useState, useRef } from 'react';
import axios from 'axios';

export default function AudioTranscription() {
    const [file, setFile] = useState(null);
    const [transcription, setTranscription] = useState(null);
    const [summary, setSummary] = useState(null);
    const [keyPoints, setKeyPoints] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRecording, setIsRecording] = useState(false);  // State for recording
    const [recordedAudio, setRecordedAudio] = useState(null);  // State for recorded audio
    const mediaRecorderRef = useRef(null);  // Ref for MediaRecorder

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const token = localStorage.getItem('authToken');  // Assuming the JWT is stored in localStorage

    // Function to handle file selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Function to handle audio upload and transcription
    const handleUpload = async (audioFile) => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('audio', audioFile || file);

        try {
            const response = await axios.post(`${API_BASE_URL}/upload/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                const data = response.data;
                setTranscription(data.transcription);
                setSummary(data.summary);
                setKeyPoints(data.key_points);
            } else {
                throw new Error('Failed to upload file');
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Audio Transcription</h1>

            <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="mb-4 p-2 border border-gray-300 rounded-md"
            />

            <button 
                onClick={() => handleUpload(recordedAudio)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Upload and Transcribe
            </button>

            {loading && <p className="mt-4 text-yellow-500">Loading...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}

            {transcription && (
                <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Transcription</h2>
                    <p className="mb-6">{transcription}</p>
                    <h2 className="text-xl font-semibold mb-4">Summary</h2>
                    <p className="mb-6">{summary}</p>
                    <h2 className="text-xl font-semibold mb-4">Key Points</h2>
                    <ul className="list-disc pl-6">
                        {keyPoints && keyPoints.map((point, index) => (
                            <li key={index} className="mb-2">{point}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
