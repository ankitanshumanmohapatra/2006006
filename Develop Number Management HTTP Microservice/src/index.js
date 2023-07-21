const express = require("express");
const axios = require("axios");
const app = express();
const port = 8008; // You can use any available port you prefer

// Middleware to parse the request query parameters
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to handle the GET /numbers request
app.get("/numbers", async (req, res) => {
  const { url } = req.query;
  const urls = Array.isArray(url) ? url : [url];

  try {
    // Fetch data from each URL using Axios in parallel
    const responses = await Promise.all(
      urls.map((url) =>
        axios.get(url, {
          timeout: 500 // Timeout for each request (500 ms)
        })
      )
    );

    // Process the responses and merge the numbers
    const numbers = [];
    responses.forEach((response) => {
      const data = response.data;
      if (Array.isArray(data.numbers)) {
        data.numbers.forEach((num) => {
          if (!numbers.includes(num)) {
            numbers.push(num);
          }
        });
      }
    });

    // Sort the merged numbers in ascending order
    numbers.sort((a, b) => a - b);

    // Send the merged and sorted numbers as the response
    return res.status(200).json({ numbers });
  } catch (error) {
    // If a URL takes too long to respond or encounters an error, ignore it and continue processing others
    console.error(`Error fetching data from URL: ${error.config.url}`);
  }

  // Send an empty response if all URLs fail or no valid URLs are provided
  return res.status(200).json({ numbers: [] });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
