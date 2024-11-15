import Link from 'next/link'
import Hero from '@/components/Hero'
import Navigation from '@/components/Navigation'
import StatsAndFeatures from '@/components/StatsAndFeatures'
import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import FeaturesSection from '@/components/FeaturesSection'

export default function HomePage() {

<<<<<<< HEAD
=======
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
>>>>>>> be7b3cb5cd7ee7013e5cf7ebc8d8e756d8398f1f

  return (
    <div className="bg-gray-50">
      <AnnouncementBanner />
      <Navigation />
      <Hero />
      <StatsAndFeatures />
      <FeaturesSection />
    </div>
  )
}