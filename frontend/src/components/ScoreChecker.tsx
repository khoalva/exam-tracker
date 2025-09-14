'use client';

import { useState } from 'react';
import { StudentScore, subjectNames } from '@/lib/database-schema';

export default function ScoreChecker() {
  const [sbd, setSbd] = useState('');
  const [studentData, setStudentData] = useState<StudentScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!sbd.trim()) {
      setError('Vui lòng nhập số báo danh');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // API call to FastAPI backend
      const response = await fetch(`http://127.0.0.1:8000/api/students/score/${sbd}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Không tìm thấy thông tin học sinh');
        } else {
          setError('Lỗi khi tải dữ liệu học sinh');
        }
        setStudentData(null);
        return;
      }

      const data = await response.json();
      setStudentData(data);
    } catch {
      setError('Lỗi kết nối mạng. Vui lòng thử lại.');
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  };

  const getScoreLevel = (score?: number) => {
    if (!score) return { level: 'N/A', color: 'text-gray-600 bg-gray-100' };
    if (score >= 8) return { level: 'Giỏi', color: 'text-green-600 bg-green-100' };
    if (score >= 6) return { level: 'Khá', color: 'text-blue-600 bg-blue-100' };
    if (score >= 4) return { level: 'Trung bình', color: 'text-yellow-600 bg-yellow-100' };
    return { level: 'Yếu', color: 'text-red-600 bg-red-100' };
  };

  const renderScoreRow = (subject: keyof typeof subjectNames, score?: number) => (
    <div key={subject} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
      <span className="font-medium text-gray-700">{subjectNames[subject]}:</span>
      {score !== undefined && score !== null ? (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreLevel(score).color}`}>
          {score.toFixed(1)} ({getScoreLevel(score).level})
        </span>
      ) : (
        <span className="px-3 py-1 rounded-full text-sm font-medium text-gray-500 bg-gray-100">
          Không có
        </span>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tra cứu điểm thi</h2>
      
      {/* Search Form */}
      <div className="mb-6">
        <label htmlFor="sbd" className="block text-sm font-medium text-gray-700 mb-2">
          Số báo danh
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            id="sbd"
            value={sbd}
            onChange={(e) => setSbd(e.target.value)}
            placeholder="Nhập số báo danh (VD: 01001001)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Student Data */}
      {studentData && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Kết quả thi THPT</h3>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-gray-700 border-b pb-2">Thông tin cơ bản</h4>
              <div className="space-y-2">
                <p><span className="font-medium text-gray-500">Số báo danh: </span> 
                   <span className="font-medium text-gray-500">{studentData.sbd}</span></p>
                {studentData.foreign_language_code && (
                  <p><span className="font-medium text-gray-500">Mã ngoại ngữ:</span> <span className="font-medium text-gray-500">{studentData.foreign_language_code}</span></p>
                )}
              </div>
            </div>

            {/* Scores */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-gray-700 border-b pb-2">Điểm các môn</h4>
              <div className="space-y-1">
                {renderScoreRow('math', studentData.math)}
                {renderScoreRow('literature', studentData.literature)}
                {renderScoreRow('foreign_language', studentData.foreign_language)}
                {renderScoreRow('physics', studentData.physics)}
                {renderScoreRow('chemistry', studentData.chemistry)}
                {renderScoreRow('biology', studentData.biology)}
                {renderScoreRow('history', studentData.history)}
                {renderScoreRow('geography', studentData.geography)}
                {renderScoreRow('civic_education', studentData.civic_education)}
              </div>
            </div>
          </div>

          {/* Group A Summary */}
          {studentData.math && studentData.physics && studentData.chemistry && (
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-gray-700">Tổng điểm khối A (Toán - Lý - Hóa)</h4>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-blue-600">
                  Tổng: {(studentData.math + studentData.physics + studentData.chemistry).toFixed(1)} điểm
                </span>
                <span className="text-md text-gray-600">
                  Trung bình: {((studentData.math + studentData.physics + studentData.chemistry) / 3).toFixed(2)} điểm
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
