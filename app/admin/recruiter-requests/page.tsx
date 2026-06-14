"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchRecruiterRequests,
  approveRecruiterRequest,
  rejectRecruiterRequest,
  getToken,
  RecruiterRequestSummary,
} from "@/lib/api";
import NotificationBell from "@/app/components/NotificationBell";

export default function AdminRecruiterRequestsPage() {
  const router = useRouter();

  const [requests, setRequests] = useState<RecruiterRequestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const token = getToken();
      if (!token) {
        setError("Unauthorized");
        return;
      }

      const data = await fetchRecruiterRequests(token, 20, 0);
      setRequests(data.requests);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    try {
      setProcessingId(id);
      const token = getToken();
      if (!token) return;

      await approveRecruiterRequest(token, id);

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "approved" } : r
        )
      );
    } finally {
      setProcessingId(null);
    }
  };

  const reject = async (id: string) => {
    const reason = prompt("Rejection reason?");
    if (!reason) return;

    try {
      setProcessingId(id);
      const token = getToken();
      if (!token) return;

      await rejectRecruiterRequest(token, id, reason);

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "rejected" } : r
        )
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        Loading recruiter requests...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* HEADER (same as JobsPage) */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            onClick={() => router.push("/admin/recruiter-requests")}
            className="text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
          >
            HireFlow Admin
          </h1>

          <div className="flex items-center gap-4">
            <NotificationBell />

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* TITLE SECTION */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Recruiter Requests
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Approve or reject recruiter applications
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && requests.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No recruiter requests
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Everything is up to date
            </p>
          </div>
        )}

        {/* REQUEST GRID (same structure vibe as JobsPage cards) */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {req.company_name}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {req.message}
              </p>

              {/* STATUS BADGE */}
              <span
                className={`text-xs inline-block px-2 py-1 rounded mb-4 ${
                  req.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : req.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {req.status}
              </span>

              {/* ACTIONS */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() =>
                    router.push(`/admin/recruiter-requests/${req.id}`)
                  }
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  View Details →
                </button>

                {req.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      disabled={processingId === req.id}
                      onClick={() => approve(req.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Approve
                    </button>

                    <button
                      disabled={processingId === req.id}
                      onClick={() => reject(req.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}