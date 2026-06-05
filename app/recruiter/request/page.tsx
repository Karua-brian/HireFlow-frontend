"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitRecruiterRequest, getToken } from "@/lib/api";

export default function RecruiterRequestPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);


// Function to log in a user, returns an authentication token on success
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = getToken();
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      await submitRecruiterRequest(token, companyName, companyWebsite, message);
      setSubmitted(true);
      router.push("/recruiter/status"); // Redirect to status page after successful submission
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="mb-4">
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Request Submitted
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ✓ Request submitted.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Awaiting admin approval.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-6">
              Redirecting to status page...
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
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Become a Recruiter
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Submit your recruiter request for admin approval
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Company Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="Safaricom"
              />
            </div>

            <div>
              <label
                htmlFor="companyWebsite"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Company Website
              </label>
              <input
                type="url"
                id="companyWebsite"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="https://safaricom.co.ke"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Message / Reason <span className="text-red-600">*</span>
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={loading}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors resize-none"
                placeholder="We want to post internship opportunities."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Want to check your status?{" "}
            <a
              href="/recruiter/status" // redirect to status page
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View status
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
