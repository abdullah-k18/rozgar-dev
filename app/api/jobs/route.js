import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const location = searchParams.get('location');
    const minSalary = searchParams.get('minSalary');
    const maxSalary = searchParams.get('maxSalary');
    const search = searchParams.get('search');
    
    let query = { status: 'active' };
    
    // Add filters if they exist
    if (location) {
      query.location = location;
    }
    
    if (minSalary) {
      query.min_salary = { $gte: parseInt(minSalary) };
    }
    
    if (maxSalary) {
      query.max_salary = { $lte: parseInt(maxSalary) };
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const skip = (page - 1) * limit;
    
    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort({ posted_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Job.countDocuments(query)
    ]);
    
    return NextResponse.json({
      jobs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error in GET /api/jobs:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const job = await Job.create(body);
    
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/jobs:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
