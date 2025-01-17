import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET() {
  try {
    await connectDB();
    
    const sialkotJob = {
      title: "Quality Assurance Manager",
      description: "Leading manufacturer of sports goods seeking an experienced Quality Assurance Manager to oversee product quality standards and testing procedures.",
      min_exp_in_years: 4,
      max_exp_in_years: 8,
      location: "Sialkot",
      remote: false,
      hybrid: false,
      on_site: true,
      tags: ["Quality Control", "ISO Standards", "Manufacturing", "Team Management", "Process Optimization", "Six Sigma", "Lean Manufacturing"],
      min_salary: 180000,
      max_salary: 280000,
      company_name: "SportsTech Manufacturing",
      required_skills: ["Quality Control", "ISO Standards", "Team Management", "Process Optimization"],
      qualifications: "Bachelor's degree in Engineering, Quality Management or related field. Six Sigma certification preferred.",
      where_to_apply: "Send your resume to careers@sportstechmanufacturing.com"
    };

    const job = await Job.create(sialkotJob);
    
    return NextResponse.json({
      message: 'Sialkot job created successfully',
      job
    });
  } catch (error) {
    console.error('Error creating Sialkot job:', error);
    return NextResponse.json(
      { error: 'Failed to create Sialkot job', details: error.message },
      { status: 500 }
    );
  }
}
