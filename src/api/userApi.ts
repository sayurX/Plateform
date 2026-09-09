import { API_BASE_URL } from './config';

export const fetchUsersApi = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};
