require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { SessionsClient } = require("@google-cloud/dialogflow");
const uuid = require("uuid");

const app = express();
app.use(express.json());
app.use(cors());

// Load Dialogflow credentials
const sessionClient = new SessionsClient({
  keyFilename: "key.json", // Path to your service account JSON file
});

const projectId = "servicelink-453409"; // Replace with your actual GCP project ID

app.post("/api/message", async (req, res) => {
  const { message, sessionId } = req.body;
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: "en",
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult.fulfillmentText;
    res.json({ reply: result });
  } catch (error) {
    console.error("Dialogflow error:", error);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
