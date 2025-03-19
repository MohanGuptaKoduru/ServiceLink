import * as functions from "firebase-functions";
import express, { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import cors from "cors";

// Create an Express app
const app = express();

// Allow CORS from any origin
const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Optionally, handle OPTIONS requests for all routes:
app.options("*", cors(corsOptions));

// Replace these with environment variables or a secrets manager in production
const SERVICE_ACCOUNT_CREDENTIALS = {
  "type": "service_account",
  "project_id": "servicelink-453409",
  "private_key_id": "8a0b600e5106d6505321a6c1d1214c99adf11d9d",
  "private_key": "-----BEGIN PRIVATE KEY-----\nh\n-----END PRIVATE KEY-----\n",
  client_email: "mohan-157@servicelink-453409.iam.gserviceaccount.com",
  client_id: "115845033731061533684",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/mohan-157%40servicelink-453409.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};


// The main route for getAccessToken
app.get("/", async (req: Request, res: Response) => {
  try {
    // Explicitly set the CORS response headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Credentials", "true");

    const now = Math.floor(Date.now() / 1000);
    const expiry = now + 3600; // 1 hour

    const jwtClaim = {
      iss: SERVICE_ACCOUNT_CREDENTIALS.client_email,
      scope: "https://www.googleapis.com/auth/cloud-platform",
      aud: SERVICE_ACCOUNT_CREDENTIALS.token_uri,
      exp: expiry,
      iat: now,
    };

    // Create the signed JWT
    const token = jwt.sign(jwtClaim, SERVICE_ACCOUNT_CREDENTIALS.private_key, { algorithm: "RS256" });

    // Prepare the form data for the token exchange
    const params = new URLSearchParams();
    params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
    params.append("assertion", token);

    // Exchange the JWT for an access token
    const response = await axios.post(SERVICE_ACCOUNT_CREDENTIALS.token_uri, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    // Return the token
    return res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error("Error generating access token:", error);
    return res.status(500).json({ error: "Failed to generate access token" });
  }
});

// Export the Express app as a Cloud Function
export const getAccessToken = functions.https.onRequest(app);