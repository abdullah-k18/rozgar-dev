"use client";

import { useEffect, useState } from "react";

export default function ScrapedDataPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/scrape`);
    
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
    
            const result = await response.json();
            console.log('API Response:', result);
    
            if (result?.data) {
                setData(result.data);
            } else {
                throw new Error("No data found in the response");
            }
        } catch (error) {
            setError(error.message || "An unexpected error occurred");
            console.error(error);
        }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Scraped Data</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : data.length > 0 ? (
        <div>
          {data.map((item, index) => (
            <div key={index}>
              <strong>Iframe {index + 1}:</strong>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
