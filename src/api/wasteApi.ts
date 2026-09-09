import { API_BASE_URL } from './config';

export const fetchWasteLogsApi = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/waste`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch waste logs');
  return response.json();
};

export const logWasteApi = async (token: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/waste`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to log waste');
  return response.json();
};

export const updateWasteLogApi = async (token: string, id: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/waste/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update waste log');
  return response.json();
};

export const deleteWasteLogApi = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/waste/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to delete waste log');
  return response.json();
};
