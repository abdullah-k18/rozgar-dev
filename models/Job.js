import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description']
  },
  min_exp_in_years: {
    type: Number,
    min: 0,
    default: 0
  },
  max_exp_in_years: {
    type: Number,
    min: 0,
    default: 0
  },
  location: {
    type: String,
    required: [true, 'Please provide a job location'],
    trim: true
  },
  remote: {
    type: Boolean,
    default: false
  },
  hybrid: {
    type: Boolean,
    default: false
  },
  on_site: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    default: []
  }],
  min_salary: {
    type: Number,
    min: 0,
    default: null
  },
  max_salary: {
    type: Number,
    min: 0,
    default: null
  },
  company_name: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true
  },
  required_skills: [{
    type: String,
    trim: true,
    default: []
  }],
  qualifications: {
    type: String,
    required: [true, 'Please provide required qualifications']
  },
  where_to_apply: {
    type: String,
    required: [true, 'Please provide application instructions']
  },
  posted_at: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active',
  }
}, {
  timestamps: true,
  versionKey: false,
  strict: false // Allow additional fields from the script
});

// Add indexes for better search performance
jobSchema.index({ title: 'text', description: 'text', company_name: 'text' });
jobSchema.index({ location: 1 });
jobSchema.index({ tags: 1 });
jobSchema.index({ required_skills: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ posted_at: -1 });

export default mongoose.models.Job || mongoose.model('Job', jobSchema);
