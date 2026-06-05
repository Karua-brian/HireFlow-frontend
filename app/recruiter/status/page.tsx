"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRecruiterRequestStatus, getToken } from "@/lib/api";

type RequestStatus = "pending" | "approved" | "rejected" | null;

interface StatusResponse {
  status: RequestStatus;
  reason?: string;
}

export default function RecruiterStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState<RequestStatus>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError("You must be logged in to view your request status");
          return;
        }

        const data: StatusResponse = await getRecruiterRequestStatus(token);
        setStatus(data.status);
        if (data.reason) {
          setReason(data.reason);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="inline-block">
              <div className="animate-spin">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading status...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Recruiter Request Status
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {!error && status === "pending" && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <svg
                    className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Status: Pending Review
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Your recruiter request is under review by our admin team. We'll
                  notify you once it's been processed.
                </p>
              </div>
            </div>
          )}

          {!error && status === "approved" && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Status: Approved
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Congratulations! You can now create jobs and manage your
                  recruiter profile.
                </p>
                <button
                  onClick={() => router.push("/jobs")}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-200 dark:focus:ring-green-800 transition-colors font-medium"
                >
                  View Jobs
                </button>
              </div>
            </div>
          )}

          {!error && status === "rejected" && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <svg
                    className="w-8 h-8 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Status: Rejected
                </p>
                {reason && (
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Reason: {reason}
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your recruiter request was not approved. Please review the
                  feedback above and feel free to submit a new request.
                </p>
                <button
                  onClick={() => router.push("/recruiter/request")}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors font-medium"
                >
                  Submit New Request
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => router.push("/jobs")}
              className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              ← Back to Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
