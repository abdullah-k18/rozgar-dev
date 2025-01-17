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
    
    let query = {};
    
    // Add filters if provided
    if (location) {
      query.location = { $regex: new RegExp(location, 'i') }; // Case-insensitive location search
    }
    if (minSalary) {
      query.min_salary = { $gte: parseInt(minSalary) };
    }
    if (maxSalary) {
      query.max_salary = { $lte: parseInt(maxSalary) };
    }
    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
        { company_name: { $regex: new RegExp(search, 'i') } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { required_skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;
    
    // Sort by createdAt if available, otherwise by _id
    const sortQuery = { $sort: { createdAt: -1, _id: -1 } };
    
    const [jobs, total] = await Promise.all([
      Job.aggregate([
        { $match: query },
        sortQuery,
        { $skip: skip },
        { $limit: limit },
        {
          $addFields: {
            createdAt: {
              $ifNull: ['$createdAt', '$_id']
            }
          }
        }
      ]),
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
    console.error('Error fetching jobs:', error);
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
