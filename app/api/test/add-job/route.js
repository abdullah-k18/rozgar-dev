import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET() {
  try {
    await connectDB();
    
    const testJob = {
      title: "Associate Software Engineer",
      description: "StackUp Technologies is looking for a skilled Associate Software Engineer to join our team in Lahore!",
      min_exp_in_years: 0,
      max_exp_in_years: 0.5,
      location: "Lahore",
      remote: false,
      hybrid: false,
      on_site: true,
      tags: ["Ruby", "Git", "Github", "GitLab", "MVC", "Mocking", "RsPec", "REST", "ORM", "HTML5", "JavaScript", "CSS3", "React JS", "VueJs"],
      min_salary: null,
      max_salary: null,
      company_name: "StackUp Technologies",
      required_skills: ["Ruby", "Git", "Github", "GitLab", "MVC", "Mocking", "RsPec", "REST", "ORM", "HTML5", "JavaScript", "CSS3"],
      qualifications: "Bachelor's degree in Computer Science or a related field",
      where_to_apply: "Send resumes to hr@stackuptechnologies.com with the subject line 'Associate Software Engineer'"
    };

    const job = await Job.create(testJob);
    
    return NextResponse.json({
      message: 'Test job created successfully',
      job
    });
  } catch (error) {
    console.error('Error creating test job:', error);
    return NextResponse.json(
      { error: 'Failed to create test job', details: error.message },
      { status: 500 }
    );
  }
}
