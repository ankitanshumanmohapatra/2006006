const express = require("express");
const axios = require("axios");
const app = express();
const port = 8008; 


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/numbers", async (req, res) => {
  const { url } = req.query;
  const urls = Array.isArray(url) ? url : [url];

  try {

    const responses = await Promise.all(
      urls.map((url) =>
        axios.get(url, {
          timeout: 500 
        })
      )
    );

 
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


    numbers.sort((a, b) => a - b);


    return res.status(200).json({ numbers });
  } catch (error) {
   
    console.error(`Error fetching data from URL: ${error.config.url}`);
  }


  return res.status(200).json({ numbers: [] });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
