'use client';

import { useState } from 'react';
import ScoreChecker from '@/components/ScoreChecker';
import Statistics from '@/components/Statistics';
import TopStudents from '@/components/TopStudents';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'score' | 'stats' | 'top10'>('score');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg p-1 shadow-md">
          <button
            onClick={() => setActiveTab('score')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'score'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            Score Checker
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'stats'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('top10')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'top10'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            Top 10 Students
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'score' && <ScoreChecker />}
        {activeTab === 'stats' && <Statistics />}
        {activeTab === 'top10' && <TopStudents />}
      </div>
    </div>
  );
}
