import { Technician, SearchResult } from "@/types/Index";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import axios from "axios";

// Cache technicians to reduce database reads
let techniciansCache: Technician[] | null = null;

// Google Cloud Project ID (used for the Vertex AI API call)
const GCP_PROJECT_ID = "servicelink-453409";

// Updated getAccessToken function calls your Cloud Function endpoint
async function getAccessToken(): Promise<string> {
  try {
    // Replace <YOUR_PROJECT_ID> with your actual Firebase project ID.
    const response = await axios.get("");
    return response.data.access_token;
  } catch (error) {
    console.error("Error calling Cloud Function for access token:", error);
    return "mock_token";
  }
}

// Function to generate embeddings using Google's Vertex AI
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    console.log("Generating embedding for:", text);
    const access_token = await getAccessToken();
    try {
      const response = await axios.post(
        `https://us-central1-aiplatform.googleapis.com/v1/projects/${GCP_PROJECT_ID}/locations/us-central1/publishers/google/models/textembedding-gecko:predict`,
        {
          instances: [{ content: text }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("Successfully got embedding from Vertex AI");
      return response.data.predictions[0].embeddings.values;
    } catch (error) {
      console.error("Error calling Vertex AI:", error);
      console.warn("Using fallback mock embedding");
      return Array(512)
        .fill(0)
        .map(() => Math.random() - 0.5);
    }
  } catch (error) {
    console.error("Error generating embedding:", error);
    console.warn("Using fallback mock embedding due to error");
    return Array(512)
      .fill(0)
      .map(() => Math.random() - 0.5);
  }
}

// Function to store embeddings in Firestore
export async function storeEmbedding(technicianId: string, embedding: number[]): Promise<void> {
  try {
    const technicianRef = doc(db, "technicians", technicianId);
    await updateDoc(technicianRef, { embedding });
    console.log("Stored embedding for technician:", technicianId);
  } catch (error) {
    console.error("Error storing embedding:", error);
  }
}

// Function to calculate cosine similarity between two vectors
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must be of the same length");
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) {
    return 0;
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Function to fetch all technicians from Firestore
export async function fetchTechnicians(): Promise<Technician[]> {
  if (techniciansCache) {
    return techniciansCache;
  }
  try {
    const techniciansRef = collection(db, "technicians");
    const snapshot = await getDocs(techniciansRef);
    const technicians: Technician[] = [];
    snapshot.forEach((doc) => {
      technicians.push({ id: doc.id, ...doc.data() } as Technician);
    });
    techniciansCache = technicians;
    return technicians;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    throw new Error("Failed to fetch technicians");
  }
}

// Main semantic search function
export async function semanticSearch(query: string): Promise<SearchResult[]> {
  try {
    console.log("Starting semantic search for query:", query);
    const queryEmbedding = await generateEmbedding(query);
    const technicians = await fetchTechnicians();
    console.log(`Fetched ${technicians.length} technicians`);

    const results: SearchResult[] = [];

    for (const technician of technicians) {
      let techEmbedding: number[];

      // Check if the technician has an embedding and if its length matches the query embedding
      if (technician.embedding && technician.embedding.length === queryEmbedding.length) {
        console.log(`Using existing embedding for ${technician.name}`);
        techEmbedding = technician.embedding;
      } else {
        console.log(`Embedding length mismatch or missing for ${technician.name}, generating a new one.`);
        // Concatenate details into a string (ensure specialties is treated as a string)
        const techDetails = [
          technician.name || "",
          technician.service || "",
          technician.description || "",
          technician.specialties || "" // Now a string, not an array
        ].join(" ");
        techEmbedding = await generateEmbedding(techDetails);
        await storeEmbedding(technician.id, techEmbedding);
      }

      // Now, both embeddings should be the same length
      const score = cosineSimilarity(queryEmbedding, techEmbedding);
      console.log(`Score for ${technician.name}: ${score}`);
      results.push({
        technician,
        score
      });
    }

    const sortedResults = results.sort((a, b) => b.score - a.score);
    console.log(`Returning ${sortedResults.length} sorted results`);
    return sortedResults;
  } catch (error) {
    console.error("Error performing semantic search:", error);
    throw new Error("Failed to perform search");
  }
}

// Function to get keyword matches for highlighting
export function getMatches(text: string, query: string): string[] {
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3);

  const matches: string[] = [];
  queryWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\w*\\b`, "gi");
    const found = text.match(regex);
    if (found) {
      matches.push(...found);
    }
  });
  return [...new Set(matches)]; // Remove duplicates
}

// Helper function to highlight matching text
export function highlightText(text: string, matches: string[]): string {
  let highlightedText = text;
  matches.forEach((match) => {
    const regex = new RegExp(`\\b${match}\\b`, "gi");
    highlightedText = highlightedText.replace(regex, `<span class="highlight">$&</span>`);
  });
  return highlightedText;
}
