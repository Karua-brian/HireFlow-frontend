"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getNotifications,
  markNotificationRead,
  getToken,
  Notification,
} from "@/lib/api";

export default function NotificationBell() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);
    return () => clearInterval(interval)
  }, []);

  async function loadNotifications() {
    try {
      const token = getToken();
      if (!token) return;

      const data = await getNotifications(token);
      setNotifications(data.data.notifications || []);
    } catch (err) {
      console.error(err);
    }
  }


  const handleRead = async (notification: Notification) => {
    try {
      const token = getToken();
      if (!token) return;

      if (!notification.is_read) {
        await markNotificationRead(token, notification.id);

        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id
            ? { ...n, is_read: true }
            :n
          )
        );
      }
      router.push("/notifications");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) {
            loadNotifications();
          }
        }}
         className="relative text-xl"
      >
        🔔

        {notifications.filter(n => !n.is_read).length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2">
            {notifications.filter(n => !n.is_read).length}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 shadow-lg rounded-lg border z-50">

          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">

            {notifications.length === 0 && (
              <p className="p-4 text-gray-500">
                No notifications
              </p>
            )}

            {notifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => handleRead(notification)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  !notification.is_read
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
              >
                <h4 className="font-medium text-gray-900 dark:text-white">
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