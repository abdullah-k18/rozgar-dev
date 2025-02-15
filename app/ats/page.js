"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Navbar from "../components/Navbar";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ATS() {
  const [file, setFile] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [suggestions, setSuggestions] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const pdfFile = acceptedFiles[0];
      setFile(pdfFile);
      extractTextFromPDF(pdfFile);
    }
  };

  const extractTextFromPDF = async (pdfFile) => {
    const formData = new FormData();
    formData.append("pdfFile", pdfFile);

    setIsLoading(true);

    try {
      const response = await fetch("/api/loader", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        fetchAtsScore(data.text);
      } else {
        setIsLoading(false);
        setSuggestions("Error extracting text.");
      }
    } catch (error) {
      setIsLoading(false);
      setSuggestions("Failed to upload or process PDF.");
    }
  };

  const fetchAtsScore = async (resumeText) => {
    const formData = new FormData();
    formData.append("resumeText", resumeText);

    try {
      const response = await fetch("/api/ats", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setAtsScore(data.atsScore);
        setSuggestions(data.suggestions);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setSuggestions("Error fetching ATS score.");
      }
    } catch (error) {
      setIsLoading(false);
      setSuggestions("Failed to fetch ATS score.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
    maxFiles: 1,
  });

  const getCircleColor = (score) => {
    if (score <= 50) return "red";
    if (score <= 84) return "yellow";
    return "green";
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center pt-20 min-h-screen">
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-400 hover:border-black group transition-colors duration-300 p-10 rounded-lg w-96 text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500">Drop the file here...</p>
          ) : (
            <div>
              <p className="text-sm">Drag & drop or click to select your CV/Resume</p>
              <p className="text-sm">Supported Format: .pdf</p>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="mt-6 w-96 p-4 text-center">
            <p>Calculating your ATS score...</p>
          </div>
        )}

        {atsScore !== null && !isLoading && (
          <div className="mt-6 w-96 p-4 rounded-lg text-center">
            <div className="w-40 h-40 mx-auto">
              <CircularProgressbarWithChildren
                value={atsScore}
                text={`${atsScore}%`}
                styles={buildStyles({
                  pathColor: getCircleColor(atsScore),
                  textColor: "#000",
                  trailColor: "#d6d6d6",
                  strokeWidth: 12,
                  textWeight: "bold"
                })}
              />
            </div>
            <p className="text-sm mt-4">{suggestions}</p>
          </div>
        )}
      </div>
    </div>
  );
}
