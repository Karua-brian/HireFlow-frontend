const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not set.");
}

/* -----------------------------
   Shared helpers
------------------------------*/

function extractError(res: any, fallback: string) {
  return (
    res?.error?.message ||
    res?.message ||
    fallback
  );
}

async function safeJson(response: Response) {
  return response.json().catch(() => ({}));
}

/* -----------------------------
   AUTH
------------------------------*/

export async function register(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const res = await safeJson(response);

  if (!response.ok) {
    throw new Error(extractError(res, "Registration failed"));
  }

  return res;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const res = await safeJson(response);

  if (!response.ok) {
    throw new Error(extractError(res, "Login failed"));
  }

  const token = res?.data?.access_token;
  if (!token) {
    throw new Error("No token returned from backend");
  }

  localStorage.setItem("user", JSON.stringify(res.user));
  return res.data;
}

/* -----------------------------
   JOBS
------------------------------*/

export async function fetchJobs(token: string) {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const res = await safeJson(response);

  if (!response.ok) {
    throw new Error(extractError(res, "Failed to fetch jobs"));
  }

  return res.data;
}

export async function applyToJob(token: string, jobId: string) {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const res = await safeJson(response);

  if (!response.ok) {
    throw new Error(extractError(res, "Failed to apply to job"));
  }

  return res.data;
}

/* -----------------------------
   RECRUITER REQUEST FLOW
------------------------------*/

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
      message,
    }),
  });

  const res = await safeJson(response);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized. Please log in again.");
    }

    if (response.status === 409) {
      throw new Error("You already submitted a recruiter request.");
    }

    throw new Error(extractError(res, "Failed to submit recruiter request"));
  }

  return res.data;
}

export async function getRecruiterRequestStatus(token: string) {
  const response = await fetch(`${API_BASE_URL}/recruiter/requests/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const res = await safeJson(response);

  if (!response.ok) {
    throw new Error(extractError(res, "Failed to fetch request status"));
  }

  return res.data;
}

/* -----------------------------
   ADMIN API
------------------------------*/
export interface RecruiterRequestSummary {
  id: string;
  user_id: string;
  company_name: string;
  message: string;
  status: "pending" | "approved" | "rejected"
}

export interface ListRecruiterRequestResponse {
  requests: RecruiterRequestSummary[];
  total: number;
  limit: number;
  offset: number;
}

export async function fetchRecruiterRequests(
  token: string,
  limit = 10,
  offset = 0
): Promise<ListRecruiterRequestResponse> {
  const response = await fetch(
    `${API_BASE_URL}/admin/recruiter-requests?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const res = await safeJson(response);

  if (!response.ok) {
    throw new Error(extractError(res, "Failed to load recruiter requests"));
  }

  return res.data;
}

export async function approveRecruiterRequest(token: string, id: string) {
  const response = await fetch(
    `${API_BASE_URL}/admin/recruiter-requests/${id}/approve`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const res = await safeJson(response);

  if (!response.ok) {
    throw new Error(extractError(res, "Failed to approve request"));
  }

  return res.data;
}

export async function rejectRecruiterRequest(
  token: string,
  id: string,
  reason: string
) {
  const response = await fetch(
    `${API_BASE_URL}/admin/recruiter-requests/${id}/reject`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    }
  );

  const res = await safeJson(response);

  if (!response.ok) {
    throw new Error(extractError(res, "Failed to reject request"));
  }

  return res.data;
} 

/* -----------------------------
   AUTH HELPERS
------------------------------*/

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}

// -----------------------------------
export function getCurrentUser() {
  const user = localStorage.getItem("user");

  if (!user) return null;

  return JSON.parse(user);
}

export function isAdmin() {
  return getCurrentUser()?.role === "admin";
}

export function isRecruiter() {
  return getCurrentUser()?.role === "recruiter";
}