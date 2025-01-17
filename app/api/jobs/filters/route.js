import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET() {
  try {
    await connectDB();
    
    // Get unique locations
    const locations = await Job.distinct('location');
    
    // Get min and max salary ranges
    const salaryRanges = await Job.aggregate([
      {
        $group: {
          _id: null,
          minSalary: { $min: '$min_salary' },
          maxSalary: { $max: '$max_salary' }
        }
      }
    ]);
    
    // Create salary range options based on actual data
    const salaryRange = salaryRanges[0] || { minSalary: 0, maxSalary: 0 };
    const step = Math.ceil((salaryRange.maxSalary - salaryRange.minSalary) / 3); // Create 3 ranges
    
    const salaryRangeOptions = [
      {
        label: `${salaryRange.minSalary.toLocaleString()} - ${(salaryRange.minSalary + step).toLocaleString()} PKR`,
        value: `${salaryRange.minSalary}-${salaryRange.minSalary + step}`
      },
      {
        label: `${(salaryRange.minSalary + step).toLocaleString()} - ${(salaryRange.minSalary + 2 * step).toLocaleString()} PKR`,
        value: `${salaryRange.minSalary + step}-${salaryRange.minSalary + 2 * step}`
      },
      {
        label: `${(salaryRange.minSalary + 2 * step).toLocaleString()}+ PKR`,
        value: `${salaryRange.minSalary + 2 * step}-${salaryRange.maxSalary}`
      }
    ];

    return NextResponse.json({
      locations: locations.sort(),
      salaryRanges: salaryRangeOptions
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}
