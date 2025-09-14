
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Gọi API backend FastAPI
    const backendUrl = 'http://localhost:8000/api/students/top10/group-a';
    const res = await fetch(backendUrl);
    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching top students from backend:', error);
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
    const students = await prisma.student.findMany({
      where: { group: 'A' },
      include: { 
        scores: {
          select: {
            math: true,
            physics: true,
            chemistry: true
          }
        }
      }
    });

    // Calculate average scores and sort
    const studentsWithAvg = students.map(student => {
      const score = student.scores[0]; // Assuming one score record per student
      const totalScore = score.math + score.physics + score.chemistry;
      const averageScore = totalScore / 3;
      
      return {
        registrationNumber: student.registrationNumber,
        fullName: student.fullName,
        math: score.math,
        physics: score.physics,
        chemistry: score.chemistry,
        totalScore,
        averageScore
      };
    }).sort((a, b) => b.averageScore - a.averageScore);

    // Add rank and take top 10
    const topStudents = studentsWithAvg.slice(0, 10).map((student, index) => ({
      ...student,
      rank: index + 1
    }));

    return NextResponse.json(topStudents);

  } catch (error) {
    console.error('Error fetching top students:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
*/
