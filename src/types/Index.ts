
export interface Technician {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    service: string;
    description: string;
    specialties?: string[];
    rating?: number;
    reviewCount?: number;
    location?: string;
    imageUrl?: string;
    contactInfo?: {
      phone?: string;
      email?: string;
    };
    availability?: string;
    embedding?: number[];
    isAvailable?: boolean;
    languages?: string[];
    createdAt?: string;
    activeJob?: string;
  }
  
  export interface SearchResult {
    technician: Technician;
    score: number;
  }
  
  // Add a new interface for the Google Cloud service account
  export interface ServiceAccountCredentials {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
    universe_domain: string;
  }
  