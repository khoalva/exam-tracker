'use client';

import { useState, useEffect } from 'react';
import { TopStudent } from '@/lib/database-schema';

const CACHE_KEY = 'topStudents';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CacheData {
  data: TopStudent[];
  timestamp: number;
}

export default function TopStudents() {
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadTopStudents();
  }, []); // loadTopStudents is stable, no need to add to dependencies

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

  const setCachedData = (data: TopStudent[]) => {
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

  const loadTopStudents = async (forceRefresh = false) => {
    try {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedData = getCachedData();
        if (cachedData && isCacheValid(cachedData)) {
          setTopStudents(cachedData.data);
          setLoading(false);
          setError('');
          return;
        }
        
        // If we have expired cache, show it while loading fresh data
        if (cachedData) {
          setTopStudents(cachedData.data);
          setLoading(false);
          setIsRefreshing(true);
        }
      } else {
        setIsRefreshing(true);
      }

      setError('');
      
      // Fetch fresh data from API
      const response = await fetch('/api/students/top10-group-a');
      
      if (!response.ok) {
        // If we have cached data, keep using it
        const cachedData = getCachedData();
        if (cachedData) {
          setTopStudents(cachedData.data);
          setError('Dữ liệu có thể không mới nhất. Lỗi khi cập nhật.');
        } else {
          setError('Lỗi khi tải dữ liệu top học sinh');
        }
        return;
      }

      const data = await response.json();
      setTopStudents(data);
      setCachedData(data);
    } catch {
      // If we have cached data, keep using it
      const cachedData = getCachedData();
      if (cachedData) {
        setTopStudents(cachedData.data);
        setError('Dữ liệu có thể không mới nhất. Lỗi kết nối mạng.');
      } else {
        setError('Lỗi kết nối mạng. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadTopStudents(true);
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 3:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Top 10 Học Sinh Khối A</h2>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600">
            Toán - Lý - Hóa
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

      {topStudents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không có dữ liệu học sinh
        </div>
      ) : (
        <div className="space-y-4">
          {topStudents.map((student) => (
            <div
              key={student.sbd}
              className={`border rounded-lg p-4 transition-all hover:shadow-md ${getRankColor(student.rank)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold w-12 text-center">
                    {getMedalIcon(student.rank)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      SBD: {student.sbd}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Hạng {student.rank}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-800">
                    {student.average_score.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Tổng: {student.total_score.toFixed(1)}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-gray-700">Toán</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {student.math?.toFixed(1) || 'N/A'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-700">Vật Lý</div>
                    <div className="text-lg font-semibold text-green-600">
                      {student.physics?.toFixed(1) || 'N/A'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-700">Hóa Học</div>
                    <div className="text-lg font-semibold text-purple-600">
                      {student.chemistry?.toFixed(1) || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="mb-2">
                <span className="font-medium">Khối A:</span> Học sinh có đủ điểm Toán, Vật Lý và Hóa Học
              </p>
              <p>
                <span className="font-medium">Xếp hạng:</span> Dựa trên điểm trung bình 3 môn
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
    </div>
  );
}
