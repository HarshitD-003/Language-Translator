import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Stats = () => {
  const [historyData] = useState([
    { sourceLang: 'English', targetLang: 'Spanish', timestamp: '14/11 12:30 PM' },
    { sourceLang: 'French', targetLang: 'English', timestamp: '14/11 11:15 AM' },
    { sourceLang: 'German', targetLang: 'Italian', timestamp: '13/11 5:45 PM' },
    { sourceLang: 'Japanese', targetLang: 'Korean', timestamp: '13/11 3:20 PM' },
    { sourceLang: 'Chinese', targetLang: 'English', timestamp: '12/11 10:00 AM' },
    { sourceLang: 'Russian', targetLang: 'Arabic', timestamp: '12/11 9:45 AM' },
    { sourceLang: 'Hindi', targetLang: 'Bengali', timestamp: '11/11 8:30 PM' },
    { sourceLang: 'Korean', targetLang: 'Vietnamese', timestamp: '11/11 7:20 PM' },
    { sourceLang: 'Italian', targetLang: 'Portuguese', timestamp: '10/11 6:10 PM' },
  ]);

  const sourceLangCounts = {};
  const targetLangCounts = {};
  const dateCounts = {};

  historyData.forEach(({ sourceLang, targetLang, timestamp }) => {
    const date = timestamp.split(' ')[0];
    sourceLangCounts[sourceLang] = (sourceLangCounts[sourceLang] || 0) + 1;
    targetLangCounts[targetLang] = (targetLangCounts[targetLang] || 0) + 1;
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });

  const sourceLangData = {
    labels: Object.keys(sourceLangCounts),
    datasets: [
      {
        data: Object.values(sourceLangCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8AC926', '#FF595E', '#6A4C93'],
        borderWidth: 1,
      },
    ],
  };

  const targetLangData = {
    labels: Object.keys(targetLangCounts),
    datasets: [
      {
        data: Object.values(targetLangCounts),
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#8AC926', '#FF595E', '#6A4C93'],
        borderWidth: 1,
      },
    ],
  };

  const dateData = {
    labels: Object.keys(dateCounts),
    datasets: [
      {
        label: 'Visits per Date',
        data: Object.values(dateCounts),
        backgroundColor: '#36A2EB',
        borderColor: '#FFF',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 mt-64">
      <h1 className="text-3xl font-bold text-center mb-8">Statistics Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Source Language Usage</h2>
          <Pie data={sourceLangData} />
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Target Language Usage</h2>
          <Pie data={targetLangData} />
        </div>
      </div>
      <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Website Visits per Date</h2>
        <Bar data={dateData} />
      </div>
    </div>
  );
};

export default Stats;
