// Database schema types for the Student Management System
// Updated to match the new simplified structure

export interface Student {
  id: number;
  sbd: string; // Số báo danh
  math?: number; // Điểm Toán
  literature?: number; // Điểm Ngữ văn
  foreign_language?: number; // Điểm Ngoại ngữ
  physics?: number; // Điểm Vật lí
  chemistry?: number; // Điểm Hóa học
  biology?: number; // Điểm Sinh học
  history?: number; // Điểm Lịch sử
  geography?: number; // Điểm Địa lí
  civic_education?: number; // Điểm GDCD
  foreign_language_code?: string; // Mã ngoại ngữ
}

export interface StudentScore {
  sbd: string;
  math?: number;
  literature?: number;
  foreign_language?: number;
  physics?: number;
  chemistry?: number;
  biology?: number;
  history?: number;
  geography?: number;
  civic_education?: number;
  foreign_language_code?: string;
}

export interface TopStudent {
  rank: number;
  sbd: string;
  math?: number;
  physics?: number;
  chemistry?: number;
  total_score: number;
  average_score: number;
}

export interface StatisticsData {
  subject: string;
  excellent: number; // >= 8
  good: number; // >= 6 && < 8
  average: number; // >= 4 && < 6
  below_average: number; // < 4
}

export interface OverallStats {
  total_students: number;
  subjects: string[];
  statistics: StatisticsData[];
}

// Sample data examples for testing
export const sampleStudents: Student[] = [
  {
    id: 1,
    sbd: '01001001',
    math: 9.5,
    literature: 8.0,
    foreign_language: 8.5,
    physics: 9.2,
    chemistry: 9.8,
    foreign_language_code: 'N1'
  },
  {
    id: 2,
    sbd: '01001002', 
    math: 9.0,
    literature: 7.8,
    foreign_language: 8.2,
    physics: 9.5,
    chemistry: 9.0,
    foreign_language_code: 'N1'
  },
  {
    id: 3,
    sbd: '01001003',
    math: 8.8,
    literature: 8.5,
    foreign_language: 8.0,
    physics: 9.0,
    chemistry: 9.2,
    foreign_language_code: 'N1'
  }
];

// Subject name mappings for display
export const subjectNames = {
  math: 'Toán',
  literature: 'Ngữ văn', 
  foreign_language: 'Ngoại ngữ',
  physics: 'Vật lí',
  chemistry: 'Hóa học',
  biology: 'Sinh học',
  history: 'Lịch sử',
  geography: 'Địa lí', 
  civic_education: 'GDCD'
};

// Group A subjects (for top students calculation)
export const groupASubjects = ['math', 'physics', 'chemistry'] as const;
