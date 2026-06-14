"use client";

import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  getToken,
  Notification,
} from "@/lib/api";
import router from "next/router";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const token = getToken();

      if (!token) return;

      const data = await getNotifications(token);

      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount =
    notifications.filter((n) => !n.is_read).length;

  const handleRead = async (id: string) => {
    try {
      const token = getToken();

      if (!token) return;

      await markNotificationRead(token, id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, is_read: true }
            : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => router.push("/notifications")}
        className="relative"
      >
        🔔

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b">
            <h3 className="font-semibold">
              Notifications
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="p-4 text-gray-500">
                No notifications
              </p>
            )}

            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() =>
                  handleRead(notification.id)
                }
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  !notification.is_read
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
              >
                <h4 className="font-medium">
                  {notification.title}
                </h4>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}