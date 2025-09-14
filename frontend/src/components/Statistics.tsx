'use client'

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CACHE_KEY = 'statistics';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CacheData {
  data: OverallStats;
  timestamp: number;
}

interface OverallStats {
  total_students: number;
  subjects: string[];
  statistics: {
    subject: string;
    excellent: number;
    good: number;
    average: number;
    below_average: number;
  }[];
}

export default function Statistics() {
  const [statsData, setStatsData] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper functions for cache management
  const getCachedData = (): CacheData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const cacheData: CacheData = JSON.parse(cached);
      return cacheData;
    } catch {
      return null;
    }
  };

  const setCachedData = (data: OverallStats) => {
    try {
      const cacheData: CacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch {
      // Ignore cache errors
    }
  };

  const isCacheValid = (cacheData: CacheData): boolean => {
    return Date.now() - cacheData.timestamp < CACHE_DURATION;
  };

  const loadStatistics = async (forceRefresh = false) => {
    try {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedData = getCachedData();
        if (cachedData && isCacheValid(cachedData)) {
          setStatsData(cachedData.data);
          setLoading(false);
          setError(null);
          if (cachedData.data.subjects.length > 0 && !selectedSubject) {
            setSelectedSubject(cachedData.data.subjects[0]);
          }
          return;
        }
        
        // If we have expired cache, show it while loading fresh data
        if (cachedData) {
          setStatsData(cachedData.data);
          setLoading(false);
          if (cachedData.data.subjects.length > 0 && !selectedSubject) {
            setSelectedSubject(cachedData.data.subjects[0]);
          }
          setIsRefreshing(true);
        }
      } else {
        setIsRefreshing(true);
      }

      setError(null);
      
      // Fetch fresh data from API
      const response = await fetch('/api/statistics');
      
      if (!response.ok) {
        // If we have cached data, keep using it
        const cachedData = getCachedData();
        if (cachedData) {
          setStatsData(cachedData.data);
          setError('Dữ liệu có thể không mới nhất. Lỗi khi cập nhật.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      setStatsData(data);
      setCachedData(data);
      
      if (data.subjects.length > 0 && !selectedSubject) {
        setSelectedSubject(data.subjects[0]);
      }
    } catch (err) {
      // If we have cached data, keep using it
      const cachedData = getCachedData();
      if (cachedData) {
        setStatsData(cachedData.data);
        setError('Dữ liệu có thể không mới nhất. Lỗi kết nối mạng.');
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadStatistics(true);
  };

  useEffect(() => {
    loadStatistics();
  }, []); // loadStatistics is stable, no need to add to dependencies

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <div className="flex justify-between items-center">
          <div>
            <strong>Error:</strong> {error}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              isRefreshing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {isRefreshing ? '⟳ Đang thử lại...' : '↻ Thử lại'}
          </button>
        </div>
      </div>
    );
  }

  if (!statsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No statistics data available.</p>
      </div>
    );
  }

  // Prepare data for bar chart
  const barChartData = {
    labels: statsData.subjects,
    datasets: [
      {
        label: 'Giỏi (≥8)',
        data: statsData.statistics.map(s => s.excellent),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Khá (≥6 & <8)',
        data: statsData.statistics.map(s => s.good),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Trung bình (≥4 & <6)',
        data: statsData.statistics.map(s => s.average),
        backgroundColor: 'rgba(234, 179, 8, 0.8)',
        borderColor: 'rgba(234, 179, 8, 1)',
        borderWidth: 1,
      },
      {
        label: 'Yếu (<4)',
        data: statsData.statistics.map(s => s.below_average),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Phân bố điểm theo từng môn học',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Số học sinh'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Môn học'
        }
      }
    },
  };

  // Prepare data for doughnut chart (selected subject)
  const selectedSubjectData = statsData.statistics.find(s => s.subject === selectedSubject);
  
  const doughnutData = {
    labels: ['Giỏi (≥8)', 'Khá (≥6 & <8)', 'Trung bình (≥4 & <6)', 'Yếu (<4)'],
    datasets: [
      {
        data: selectedSubjectData 
          ? [selectedSubjectData.excellent, selectedSubjectData.good, selectedSubjectData.average, selectedSubjectData.below_average]
          : [0, 0, 0, 0],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: `Phân bố điểm - ${selectedSubject}`,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Báo cáo thống kê</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Tổng số học sinh: <span className="font-semibold">{statsData?.total_students?.toLocaleString?.() ?? 0}</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              isRefreshing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isRefreshing ? '⟳ Đang cập nhật...' : '↻ Làm mới'}
          </button>
        </div>
      </div>

      {/* Overall Bar Chart */}
      <div className="mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      {/* Subject-specific Doughnut Chart */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Chọn môn học</h3>
          <div className="space-y-2">
            {statsData.subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedSubject === subject
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
          
          {/* Subject Statistics Table */}
          {selectedSubjectData && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3 text-gray-700">Thống kê {selectedSubject}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">Giỏi:</span>
                  <span className="font-medium text-gray-500">{selectedSubjectData?.excellent?.toLocaleString()} học sinh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Khá:</span>
                  <span className="font-medium text-gray-500">{selectedSubjectData?.good?.toLocaleString()} học sinh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">Trung bình:</span>
                  <span className="font-medium text-gray-500">{selectedSubjectData?.average?.toLocaleString()} học sinh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Yếu:</span>
                  <span className="font-medium text-gray-500">{selectedSubjectData?.below_average?.toLocaleString?.() ?? 0} học sinh</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Cache Status */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <p>
              <span className="font-medium">Ghi chú:</span> Dữ liệu được cập nhật tự động và cache trong 5 phút
            </p>
          </div>
          {(() => {
            const cachedData = getCachedData();
            if (cachedData) {
              const timeAgo = Math.floor((Date.now() - cachedData.timestamp) / 1000);
              const isExpired = !isCacheValid(cachedData);
              return (
                <div className={`text-xs px-2 py-1 rounded ${
                  isExpired ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {isExpired ? '⚠️ Dữ liệu cũ' : '✓ Dữ liệu mới'} 
                  <br />
                  {timeAgo < 60 ? `${timeAgo}s` : `${Math.floor(timeAgo / 60)}m`} trước
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
}