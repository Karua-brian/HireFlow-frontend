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
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error");
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
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading admin requests...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Recruiter Requests (Admin)
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {req.company_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {req.message}
                </p>

                <span
                  className={`text-xs mt-2 inline-block px-2 py-1 rounded ${
                    req.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : req.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {req.status}
                </span>
              </div>

              <div className="flex gap-2">
                {req.status === "pending" && (
                  <>
                    <button
                      disabled={processingId === req.id}
                      onClick={() => approve(req.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Approve
                    </button>

                    <button
                      disabled={processingId === req.id}
                      onClick={() => reject(req.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Reject
                    </button>
                  </>
                )}

                <button
                  onClick={() =>
                    router.push(`/admin/recruiter-requests/${req.id}`)
                  }
                  className="px-3 py-1 bg-gray-600 text-white rounded"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}