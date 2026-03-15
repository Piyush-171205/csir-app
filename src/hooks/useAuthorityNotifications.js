import { useState, useEffect } from 'react';
import { notificationTypes } from '../data/authorityData.js';

export const useAuthorityNotifications = (department, complaints) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications from localStorage or create initial ones
    const stored = localStorage.getItem(`notifications_${department}`);
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      // Create initial notifications based on complaints
      const initialNotifs = complaints.map(complaint => ({
        id: `notif_${complaint.id}`,
        type: notificationTypes.NEW_COMPLAINT,
        title: 'New Complaint Assigned',
        message: `New complaint #${complaint.id} from ${complaint.userName}`,
        complaintId: complaint.id,
        read: false,
        timestamp: new Date().toISOString(),
        priority: complaint.priority || 'normal'
      }));
      setNotifications(initialNotifs);
    }
  }, [department, complaints]);

  useEffect(() => {
    // Update unread count whenever notifications change
    setUnreadCount(notifications.filter(n => !n.read).length);
    // Save to localStorage
    localStorage.setItem(`notifications_${department}`, JSON.stringify(notifications));
  }, [notifications, department]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  };
};