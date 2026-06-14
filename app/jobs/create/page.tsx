"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { createJob, getToken } from "@/lib/api";

export default function CreateJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = getToken();

      if (!token) {
        setError("Please login again");
        return;
      }

      await createJob(token, {
        title,
        description,
        company,
        location,
        salary,
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/jobs");
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create job"
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-green-600">
            Job Created Successfully 🎉
          </h2>
          <p className="text-gray-600 mt-2">
            Redirecting to jobs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create Job Posting
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />

          <textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full p-3 border rounded"
            required
          />

          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />

          <input
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full p-3 border rounded"
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Job"}
          </button>
        </form>
      </div>
    </div>
  );
}