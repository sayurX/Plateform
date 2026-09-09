import { API_BASE_URL } from './config';

export const fetchIngredientsApi = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/inventory`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch ingredients');
  return response.json();
};

export const addIngredientApi = async (token: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/inventory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add ingredient');
  return response.json();
};

export const updateStockApi = async (token: string, id: string, quantity: number) => {
  const response = await fetch(`${API_BASE_URL}/inventory/${id}/stock`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });
  if (!response.ok) throw new Error('Failed to update stock');
  return response.json();
};

export const deleteIngredientApi = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to delete ingredient');
  return response.json();
};
export const updateIngredientApi = async (token: string, id: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update ingredient');
  return response.json();
};
