import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

const sampleJobs = [
  {
    title: "Senior Full Stack Developer",
    description: "Join our dynamic team as a Senior Full Stack Developer. You'll be responsible for developing scalable web applications using modern technologies.",
    min_exp_in_years: 5,
    max_exp_in_years: 8,
    location: "Karachi",
    remote: true,
    hybrid: true,
    on_site: false,
    tags: ["React", "Node.js", "MongoDB", "AWS", "Docker", "TypeScript", "Redux", "Express"],
    min_salary: 300000,
    max_salary: 500000,
    company_name: "TechVision Solutions",
    required_skills: ["React", "Node.js", "MongoDB", "AWS", "Docker"],
    qualifications: "Bachelor's/Master's degree in Computer Science or related field",
    where_to_apply: "Apply through our careers portal at careers.techvision.com"
  },
  {
    title: "Product Manager",
    description: "Looking for an experienced Product Manager to lead our product development initiatives and drive innovation.",
    min_exp_in_years: 3,
    max_exp_in_years: 6,
    location: "Islamabad",
    remote: false,
    hybrid: true,
    on_site: true,
    tags: ["Product Management", "Agile", "Scrum", "User Research", "Data Analytics", "Product Strategy"],
    min_salary: 250000,
    max_salary: 400000,
    company_name: "InnovateX",
    required_skills: ["Product Management", "Agile", "Scrum", "Data Analytics"],
    qualifications: "Bachelor's degree in Business, Computer Science, or related field",
    where_to_apply: "Send your resume to careers@innovatex.pk"
  },
  {
    title: "UI/UX Designer",
    description: "We're seeking a creative UI/UX Designer to craft beautiful and intuitive user experiences for our products.",
    min_exp_in_years: 2,
    max_exp_in_years: 4,
    location: "Lahore",
    remote: true,
    hybrid: false,
    on_site: false,
    tags: ["Figma", "Adobe XD", "Sketch", "User Research", "Wireframing", "Prototyping", "Design Systems"],
    min_salary: 150000,
    max_salary: 250000,
    company_name: "DesignCraft Studios",
    required_skills: ["Figma", "Adobe XD", "Sketch", "User Research"],
    qualifications: "Bachelor's degree in Design, HCI, or related field",
    where_to_apply: "Portfolio and resume to design@designcraft.com"
  },
  {
    title: "DevOps Engineer",
    description: "Join our infrastructure team to build and maintain robust CI/CD pipelines and cloud infrastructure.",
    min_exp_in_years: 3,
    max_exp_in_years: 5,
    location: "Karachi",
    remote: true,
    hybrid: true,
    on_site: true,
    tags: ["AWS", "Kubernetes", "Docker", "Jenkins", "Terraform", "Linux", "Python", "Shell Scripting"],
    min_salary: 200000,
    max_salary: 350000,
    company_name: "CloudTech Systems",
    required_skills: ["AWS", "Kubernetes", "Docker", "Jenkins", "Terraform"],
    qualifications: "Bachelor's degree in Computer Science or related field",
    where_to_apply: "Apply at careers.cloudtech.pk/devops"
  }
];

export async function GET() {
  try {
    await connectDB();
    
    const jobs = await Promise.all(
      sampleJobs.map(job => Job.create(job))
    );
    
    return NextResponse.json({
      message: 'Sample jobs created successfully',
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Error creating sample jobs:', error);
    return NextResponse.json(
      { error: 'Failed to create sample jobs', details: error.message },
      { status: 500 }
    );
  }
}
