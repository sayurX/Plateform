import { API_BASE_URL } from './config';

export const fetchReviewsApi = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
};

export const fetchMyReviewsApi = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/reviews/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch my reviews');
  return response.json();
};

export const createReviewApi = async (token: string, data: { food?: string; order?: string; rating: number; comment: string }) => {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create review');
  return response.json();
};

export const deleteReviewApi = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to delete review');
  return response.json();
};
