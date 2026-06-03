// API Helper functions for interacting with the Hireflow API

// Base URL for the API, taken from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.hireflow.space';

// Function to register a new user
export async function register(email: string, password: string) { 
  const response = await fetch(`${API_BASE_URL}/register`, { 
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }), // Send email and password in the request body as JSON
  });

  if (!response.ok) { // If the response is not OK, attempt to parse the error message from the response
    const data = await response.json().catch(() => ({})); // Attempt to parse the response as JSON, but if it fails, use an empty object
    throw new Error(data.message || "Registration failed"); // Throw an error with the message from the response, or a generic message if parsing fails
  }

  return response.json(); // If the response is OK, parse and return the JSON data from the response
}

// Function to log in an existing user
export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Login failed");
  }

  return response.json();
}

// Function to fetch job listings, requires an authentication token
export async function fetchJobs(token: string) { // Accept an authentication token as a parameter
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Failed to fetch jobs");
  }

  return response.json();
}

// Function to apply to a job, requires an authentication token and the job ID
export async function applyToJob(token: string, jobId: string) {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Failed to apply to job");
  }

  return response.json();
}