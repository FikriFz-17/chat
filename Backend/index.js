const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post("http://localhost:11434/api/chat", {
      model: "deepseek-r1:1.5b", 
      messages: [{ role: "user", content: userMessage }],
      stream: false
    });

    const botMessage = response.data.message.content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    res.json({ reply: botMessage });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to communicate with Ollama" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
