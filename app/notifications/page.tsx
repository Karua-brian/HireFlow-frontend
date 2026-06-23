"use client";

import { useEffect, useState } from "react";
import {
getNotifications,
markNotificationRead,
getToken,
Notification,
} from "@/lib/api";

export default function NotificationsPage() {
const [notifications, setNotifications] = useState<Notification[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 10000);
    return () => clearInterval(interval)
  }, []);

useEffect(() => {
  const onFocus = () => loadNotifications();

  window.addEventListener("focus", onFocus);

  return () => window.removeEventListener("focus", onFocus);
}, []);  

  async function loadNotifications() {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setError("Please login first");
        return;
      }

      const data = await getNotifications(token);

      setNotifications(data || []);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }

  }

const handleRead = async (notification: Notification) => {
try {
const token = getToken();
if (!token) return;


  if (!notification.is_read) {
    await markNotificationRead(token, notification.id);
    await loadNotifications();

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id
          ? { ...n, is_read: true }
          : n
      )
    );
  }

  if (notification.link) {
    window.location.href = notification.link;
  }
} catch (err) {
  console.error(err);
}


};


if (loading) {
return ( <div className="min-h-screen flex justify-center items-center"> <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> </div>
);
}

return ( 
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">

  <header className="bg-white dark:bg-gray-800 border-b">
    <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Notifications
      </h1>

      <span className="text-sm text-gray-600 dark:text-gray-400">
        {notifications.filter(
            (n) => !n.is_read
          ).length} unread
      </span>

    </div>
  </header>

  <main className="max-w-4xl mx-auto px-6 py-8">

    {error && (
      <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700">
        {error}
      </div>
    )}

    {notifications.length === 0 && (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No notifications yet.
        </p>
      </div>
    )}

    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => handleRead(notification)}
          className={`cursor-pointer rounded-lg shadow p-5 transition hover:shadow-md
            ${
              notification.is_read
                ? "bg-white dark:bg-gray-800"
                : "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600"
            }
          `}
        >
          <div className="flex justify-between items-start">

            <div className="flex-1">

              <h2 className="font-semibold text-gray-900 dark:text-white">
                {notification.title}
              </h2>

              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {notification.message}
              </p>

              <p className="mt-3 text-xs text-gray-500">
                {new Date(
                  notification.created_at
                ).toLocaleString()}
              </p>

            </div>

            {!notification.is_read && (
              <span className="ml-4 h-3 w-3 rounded-full bg-blue-600"></span>
            )}

          </div>
        </div>
      ))}
    </div>

  </main>
  </div>

  );
}
