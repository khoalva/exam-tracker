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

    // TODO: Replace this with actual database query
    // Example using Prisma:
    // const student = await prisma.student.findUnique({
    //   where: { registrationNumber },
    //   include: { scores: true }
    // });

    // Mock data for demonstration
    const mockStudent: StudentScore = {
      registrationNumber: registrationNumber,
      fullName: "John Doe",
      math: 8.5,
      physics: 7.8,
      chemistry: 9.0,
      literature: 6.5,
      english: 7.2,
      totalScore: 39.0,
      averageScore: 7.8,
      group: "A"
    };

    // For demo purposes, return mock data if registration number exists
    if (registrationNumber === "DEMO001" || registrationNumber.length >= 5) {
      return NextResponse.json(mockStudent);
    }

    // Return 404 if student not found
    return NextResponse.json(
      { error: "Student not found" },
      { status: 404 }
    );

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
