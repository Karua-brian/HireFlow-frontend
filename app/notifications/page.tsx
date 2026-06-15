"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Notification,
  getNotifications,
  markNotificationRead,
  getToken,
} from "@/lib/api";

export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      const token = getToken();

      if (!token) {
        setError("Please log in.");
        return;
      }

      const data = await getNotifications(token);
      setNotifications(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleOpen = async (notification: Notification) => {
    try {
      const token = getToken();
      if (!token) return;

      if (!notification.is_read) {
        await markNotificationRead(token, notification.id);

        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id
              ? { ...n, is_read: true }
              : n
          )
        );
      }

      router.push(notification.link);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* HEADER (consistent with Jobs/Admin) */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1
            onClick={() => router.push("/jobs")}
            className="text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
          >
            HireFlow
          </h1>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium"
          >
            Logout
          </button>

        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto px-6 py-8">

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Notifications
        </h1>

        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No notifications yet.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border-l-4 transition-all ${
                notification.is_read
                  ? "border-gray-300"
                  : "border-blue-600"
              }`}
            >

              <div className="flex justify-between items-start gap-4">

                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {notification.title}
                  </h2>

                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {notification.message}
                  </p>

                  <p className="mt-3 text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>

                {!notification.is_read && (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    New
                  </span>
                )}

              </div>

              <button
                onClick={() => router.push("/status")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open
              </button>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}