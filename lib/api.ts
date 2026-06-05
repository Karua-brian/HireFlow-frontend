// API Helper functions for interacting with the Hireflow API

// Base URL for the API, taken from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; 

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn("Warning: NEXT_PUBLIC_API_URL is not set. Using default API URL.");
}

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

  const res = await response.json();  // Attempt to parse the response as JSON, but if it fails, use an empty object
  if (!response.ok) {
    throw new Error(res?.error?.message || "Login failed");
  }

  const token = res.data?.access_token;
  if (!token) {
    console.log("Response from backend:", res); // Log the full response for debugging purposes
    throw new Error("No token returned from backend"); // If no token is found in the response, throw an error
  }

  localStorage.setItem("token", token); // Store the authentication token in localStorage for later use

  return res; // Return the parsed JSON data from the response, which may include user information and the authentication token
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

// Function to get the current authentication token from localStorage
export function getToken() {
  return localStorage.getItem("token"); // Retrieve the token from localStorage, or return null if it doesn't exist
}

// Function to log out the user by clearing the authentication token from localStorage
export function logout() {
  localStorage.removeItem("token"); // Remove the token from localStorage to log out the user
}

// Function to submit a recruiter request
export async function submitRecruiterRequest(
  token: string,
  companyName: string,
  companyWebsite: string,
  message: string
) {
  const response = await fetch(`${API_BASE_URL}/recruiter/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      company_name: companyName,
      company_website: companyWebsite,
      message: message,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
  
    if (response.status === 401) { // If the response status is 401 Unauthorized, throw a specific error message
      throw new Error("Unauthorized. Please log in again.");
    }
    throw new Error(data.message || "Failed to submit recruiter request");
  }

  return response.json();
}

// Function to get recruiter request status
export async function getRecruiterRequestStatus(token: string) {
  const response = await fetch(`${API_BASE_URL}/recruiter/status`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Failed to fetch request status");
  }

  return response.json();
}
