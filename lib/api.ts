// API Helper functions for interacting with the Hireflow API

// Base URL for the API, taken from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.hireflow.space';

export async function register(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Registration failed");
  }

  return response.json();
}