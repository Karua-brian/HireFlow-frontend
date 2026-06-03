"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register as registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter(); // Hook for programmatic navigation
  const [email, setEmail] = useState(""); // State to hold the email input value
  const [password, setPassword] = useState(""); // State to hold the password input value
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle form submission for user registration
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // Type annotation for the form event
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear any existing error messages
    setLoading(true); // Set loading state to true while the registration request is being processed

    // Attempt to register the user with the provided email and password
    try {
      await registerUser(email, password); // Call the register function from the API module
      setSuccess(true); // Set success state to true to show a success message
      setEmail(""); // Clear the email input field
      setPassword("");
      
      setTimeout(() => {
        router.push("/login"); // Redirect to login page after a short delay
      }, 2000);
    } catch (err) { // If an error occurs during registration, set the error state to display the error message
      setError(err instanceof Error ? err.message : "An error occurred"); // Check if the error is an instance of Error and use its message, otherwise use a generic error message
    } finally { // Finally, set loading state back to false regardless of success or failure
      setLoading(false);
    }
  };

  // Render the registration form and any success or error messages
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Create Account
          </h1>

          {success && ( // If registration is successful, show a success message
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
              Registration successful! Redirecting to login...
            </div>
          )}

          {error && ( // If there is an error, show the error message
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
              {error} 
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="you@example.com"
              />
            </div>

             <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
