"use client";

import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { Building2, MapPin, Banknote, Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import Navbar from "../components/Navbar";

const dummyJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    location: "Karachi, Pakistan",
    salary: "150,000 - 250,000 PKR",
    type: "Full-time",
    posted: "2 days ago",
    description: "We are looking for an experienced Frontend Developer with React expertise...",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "InnovateX",
    location: "Lahore, Pakistan",
    salary: "200,000 - 300,000 PKR",
    type: "Full-time",
    posted: "1 day ago",
    description: "Seeking a dynamic Product Manager to lead our product development initiatives...",
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "CloudTech Systems",
    location: "Islamabad, Pakistan",
    salary: "180,000 - 280,000 PKR",
    type: "Remote",
    posted: "3 days ago",
    description: "Join our DevOps team to build and maintain scalable infrastructure...",
  },
];

export default function Jobs() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    salary: "",
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleApplyFilters = () => {
    // Here you would implement the actual filtering logic
    console.log("Applying filters:", filters);
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <Navbar handleOpenDialog={handleOpenDialog} />
      <Box sx={{ height: { xs: "4rem", lg: "5rem" } }} /> {/* Spacer for navbar */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Filters Section */}
        <Card sx={{ mb: 4, p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Search Jobs"
                variant="outlined"
                placeholder="Job title or keyword"
                value={filters.search}
                onChange={handleFilterChange('search')}
                InputProps={{
                  endAdornment: <SearchIcon size={20} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select 
                  label="Location" 
                  value={filters.location}
                  onChange={handleFilterChange('location')}
                >
                  <MenuItem value="">All Locations</MenuItem>
                  <MenuItem value="karachi">Karachi</MenuItem>
                  <MenuItem value="lahore">Lahore</MenuItem>
                  <MenuItem value="islamabad">Islamabad</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Salary Range</InputLabel>
                <Select 
                  label="Salary Range" 
                  value={filters.salary}
                  onChange={handleFilterChange('salary')}
                >
                  <MenuItem value="">All Ranges</MenuItem>
                  <MenuItem value="0-100k">0 - 100,000 PKR</MenuItem>
                  <MenuItem value="100k-200k">100,000 - 200,000 PKR</MenuItem>
                  <MenuItem value="200k+">200,000+ PKR</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleApplyFilters}
                sx={{
                  backgroundColor: "#4b8b93",
                  height: "56px", // Match height with other inputs
                  "&:hover": {
                    backgroundColor: "#3d7179",
                  },
                }}
              >
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Jobs List */}
        <Grid container spacing={3}>
          {dummyJobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Card 
                sx={{ 
                  '&:hover': {
                    boxShadow: 6,
                    cursor: 'pointer'
                  }
                }}
              >
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6" component="h2" color="#4b8b93">
                        {job.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Building2 size={18} />
                        <Typography variant="body2" color="text.secondary">
                          {job.company}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <MapPin size={18} />
                        <Typography variant="body2" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Banknote size={18} />
                        <Typography variant="body2" color="text.secondary">
                          {job.salary}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {job.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip 
                          label={job.type} 
                          size="small" 
                          sx={{ 
                            backgroundColor: '#4b8b93',
                            color: 'white'
                          }}
                        />
                        <Chip 
                          label={job.posted} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
