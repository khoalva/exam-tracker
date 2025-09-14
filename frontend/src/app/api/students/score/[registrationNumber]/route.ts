import { NextRequest, NextResponse } from 'next/server';

// This is a placeholder API endpoint
// You'll need to implement the actual database logic here

interface StudentScore {
  registrationNumber: string;
  fullName: string;
  math: number;
  physics: number;
  chemistry: number;
  literature: number;
  english: number;
  totalScore: number;
  averageScore: number;
  group: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ registrationNumber: string }> }
) {
  try {
    const { registrationNumber } = await params;


    // Fetch from FastAPI backend
    const apiUrl = `https://myapp-xsg2.onrender.com/api/students/score/${registrationNumber}`;
    const res = await fetch(apiUrl);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    } else if (res.status === 404) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    } else {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error fetching student score:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Example implementation with Prisma (commented out):
/*
export async function GET(
  request: NextRequest,
  { params }: { params: { registrationNumber: string } }
) {
  try {
    const { registrationNumber } = params;

    const student = await prisma.student.findUnique({
      where: { registrationNumber },
      include: {
        scores: true
      }
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    const scores = student.scores[0]; // Assuming one score record per student
    const totalScore = scores.math + scores.physics + scores.chemistry + scores.literature + scores.english;
    const averageScore = totalScore / 5;

    const response: StudentScore = {
      registrationNumber: student.registrationNumber,
      fullName: student.fullName,
      math: scores.math,
      physics: scores.physics,
      chemistry: scores.chemistry,
      literature: scores.literature,
      english: scores.english,
      totalScore,
      averageScore,
      group: student.group
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching student score:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
*/
