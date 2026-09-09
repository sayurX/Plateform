import { API_BASE_URL } from './config';

export const fetchFoodsApi = async () => {
  const response = await fetch(`${API_BASE_URL}/foods`);
  if (!response.ok) throw new Error('Failed to fetch foods');
  return response.json();
};

export const fetchCategoriesApi = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const addFoodApi = async (token: string, foodData: any) => {
  const response = await fetch(`${API_BASE_URL}/foods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(foodData),
  });
  if (!response.ok) throw new Error('Failed to add food');
  return response.json();
};

export const updateFoodApi = async (token: string, id: string, foodData: any) => {
  const response = await fetch(`${API_BASE_URL}/foods/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(foodData),
  });
  if (!response.ok) throw new Error('Failed to update food');
  return response.json();
};

export const deleteFoodApi = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/foods/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete food');
  return response.json();
};
