'use client'
import { useState } from 'react';

export default function UploadAudio() {
  const [audioFile, setAudioFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', audioFile);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit">Upload Audio</button>
      </form>

      {result && (
        <div>
          <h3>Transcription:</h3>
          <p>{result.transcription}</p>
          <h3>Summary:</h3>
          <p>{result.summary}</p>
          <h3>Key Points:</h3>
          <ul>
            {result.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
