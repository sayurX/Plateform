import { API_BASE_URL } from './config';

export const fetchMyNotificationsApi = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch notifications');
  return response.json();
};

export const fetchAllNotificationsApi = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/notifications/all`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch all notifications');
  return response.json();
};

export const markNotificationReadApi = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to mark notification as read');
  return response.json();
};
