
import { collection, addDoc, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Technician } from "@/types/Index";

// Sample technician data
const sampleTechnicians: Omit<Technician, 'id'>[] = [
  {
    name: "Rishi",
    email: "rishi@example.com",
    phone: "9876512345",
    role: "technician",
    service: "Plumbing",
    description: "Experienced plumber specializing in fixing water pumps, pipe leakages, and bathroom fixtures. Available for emergency plumbing services.",
    specialties: ["Water Pump Repair", "Pipe Installation", "Leak Detection", "Bathroom Fixtures", "Emergency Repairs"],
    rating: 4.8,
    reviewCount: 124,
    location: "Mumbai, India",
    isAvailable: true,
    languages: ["English", "Hindi"],
    createdAt: new Date().toISOString(),
  },
  {
    name: "Anjali",
    email: "anjali@example.com",
    phone: "9856432178",
    role: "technician",
    service: "Electrical",
    description: "Certified electrician specializing in home electrical systems, wiring, circuit repairs and installations. Can handle power outages and electrical emergencies.",
    specialties: ["Wiring", "Circuit Repair", "Electrical Panel", "Power Outages", "Lighting Installation"],
    rating: 4.9,
    reviewCount: 89,
    location: "Delhi, India",
    isAvailable: true,
    languages: ["English", "Hindi"],
    createdAt: new Date().toISOString(),
  },
  {
    name: "Rahul",
    email: "rahul@example.com",
    phone: "8765432190",
    role: "technician",
    service: "HVAC",
    description: "HVAC expert with certification in heating and air conditioning systems. Specializes in AC installation, repair, and maintenance. Can fix cooling issues and heating problems.",
    specialties: ["AC Installation", "Heating Repair", "Ventilation", "Cooling Systems", "AC Servicing"],
    rating: 4.7,
    reviewCount: 65,
    location: "Bangalore, India",
    isAvailable: true,
    languages: ["English", "Kannada"],
    createdAt: new Date().toISOString(),
  },
  {
    name: "Priya",
    email: "priya@example.com",
    phone: "7865432109",
    role: "technician",
    service: "Appliance Repair",
    description: "Specialized in repairing all major home appliances including refrigerators, washing machines, and water purifiers. Experienced in fixing water motors and pumps for homes.",
    specialties: ["Refrigerator Repair", "Washer/Dryer Fix", "Dishwasher Service", "Water Purifier", "Water Pump"],
    rating: 4.6,
    reviewCount: 72,
    location: "Chennai, India",
    isAvailable: true,
    languages: ["English", "Tamil"],
    createdAt: new Date().toISOString(),
  },
  {
    name: "Vikram",
    email: "vikram@example.com",
    phone: "8976543210",
    role: "technician",
    service: "Carpentry",
    description: "Skilled carpenter with experience in furniture and cabinet making. Can handle wooden door repairs and window frame installation.",
    specialties: ["Furniture Assembly", "Cabinet Making", "Woodwork", "Door Repair", "Window Frames"],
    rating: 4.5,
    reviewCount: 103,
    location: "Hyderabad, India",
    isAvailable: true,
    languages: ["English", "Telugu"],
    createdAt: new Date().toISOString(),
  },
  {
    name: "Aakash",
    email: "aakash@example.com",
    phone: "9988776655",
    role: "technician",
    service: "Water Systems",
    description: "Water systems expert specializing in water pumps, tanks, and purification systems. Can troubleshoot and repair all types of water motors and pumping systems for homes and buildings.",
    specialties: ["Water Motor Repair", "Submersible Pumps", "Water Tank Installation", "Pressure Boosting", "Pipe Fitting"],
    rating: 4.9,
    reviewCount: 87,
    location: "Pune, India",
    isAvailable: true,
    languages: ["English", "Marathi", "Hindi"],
    createdAt: new Date().toISOString(),
  },
  {
    name: "Sanjay",
    email: "sanjay@example.com",
    phone: "8899776655",
    role: "technician",
    service: "General Maintenance",
    description: "All-round home maintenance technician with expertise in plumbing, basic electrical work, and water pump repairs. Available for emergency fixes and regular maintenance.",
    specialties: ["Plumbing", "Basic Electrical", "Water Pump Fixing", "Home Maintenance", "Leak Repair"],
    rating: 4.7,
    reviewCount: 113,
    location: "Mumbai, India",
    isAvailable: true,
    languages: ["English", "Hindi", "Marathi"],
    createdAt: new Date().toISOString(),
  }
];

// Function to upload sample data to Firestore
export async function uploadSampleData() {
  try {
    const batch = writeBatch(db);
    const techCollection = collection(db, "technicians");
    
    let i = 0;
    for (const technician of sampleTechnicians) {
      const docRef = doc(techCollection);
      batch.set(docRef, technician);
      i++;
    }
    
    await batch.commit();
    console.log(`Successfully uploaded ${i} sample technicians`);
    return i;
  } catch (error) {
    console.error("Error uploading sample data:", error);
    throw new Error("Failed to upload sample data");
  }
}
