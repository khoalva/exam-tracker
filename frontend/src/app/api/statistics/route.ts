
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Gọi API backend FastAPI
    const backendUrl = 'http://localhost:8000/api/statistics';
    const res = await fetch(backendUrl);
    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching statistics from backend:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Example implementation with Prisma (commented out):
/*
export async function GET() {
  try {
    const subjects = ['math', 'physics', 'chemistry', 'literature', 'english'];
    const statistics: StatisticsData[] = [];

    for (const subject of subjects) {
      const excellent = await prisma.score.count({
        where: { [subject]: { gte: 8 } }
      });
      
      const good = await prisma.score.count({
        where: { 
          AND: [
            { [subject]: { gte: 6 } },
            { [subject]: { lt: 8 } }
          ]
        }
      });
      
      const average = await prisma.score.count({
        where: { 
          AND: [
            { [subject]: { gte: 4 } },
            { [subject]: { lt: 6 } }
          ]
        }
      });
      
      const belowAverage = await prisma.score.count({
        where: { [subject]: { lt: 4 } }
      });

      statistics.push({
        subject: subject.charAt(0).toUpperCase() + subject.slice(1),
        excellent,
        good,
        average,
        belowAverage
      });
    }

    const totalStudents = await prisma.student.count();

    const response: OverallStats = {
      totalStudents,
      subjects: subjects.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
      statistics
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
*/
