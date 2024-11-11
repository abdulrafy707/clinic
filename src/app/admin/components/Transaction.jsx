'use client'
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

const TranscriptionChart = () => {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [interval, setInterval] = useState('daily'); // Default interval
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define labels based on interval
  const getLabelsForInterval = (interval) => {
    if (interval === 'daily') {
      return ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'];
    } else if (interval === 'weekly') {
      return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    } else if (interval === 'monthly') {
      return Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    } else if (interval === 'yearly') {
      return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }
  };

  // Fetch transcription count data based on selected interval
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/count-transcriptions?interval=${interval}`);
        const counts = response.data.data;

        console.log(`Data for ${interval}:`, counts);

        // Use array directly if available, or fallback to a generated array
        let transcriptionData;
        switch (interval) {
          case 'daily':
            transcriptionData = counts.dailyCounts || Array(6).fill(0); // 6 points for 4-hour intervals
            break;
          case 'weekly':
            transcriptionData = counts.weeklyCounts || Array(7).fill(0); // 7 days in a week
            break;
          case 'monthly':
            transcriptionData = counts.monthlyCounts || Array(31).fill(0); // 31 days in a month
            break;
          case 'yearly':
            transcriptionData = counts.yearlyCounts || Array(12).fill(0); // 12 months in a year
            break;
          default:
            transcriptionData = [];
        }

        setData(transcriptionData);
        setLabels(getLabelsForInterval(interval));
      } catch (err) {
        setError('Failed to fetch transcription data');
        console.error("Fetch error:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [interval]);

  // Check if there's no data to display
  const noData = !loading && data.every((point) => point === 0);

  // Chart configuration
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Transcriptions',
        data: data,
        borderColor: '#007BFF',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#007BFF',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333',
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#666',
          callback: (value) => value.toLocaleString(), // Format numbers with commas
        },
        grid: {
          color: '#e0e0e0',
          lineWidth: 0.5,
        },
      },
      x: {
        ticks: { color: '#666' },
        grid: { display: false },
      },
    },
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">Transcriptions Overview</h2>
        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {noData ? (
        <p className="text-gray-500 text-center">No transcription data available for this interval.</p>
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default TranscriptionChart;
