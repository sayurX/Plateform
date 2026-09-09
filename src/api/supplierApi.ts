import { API_BASE_URL } from './config';

export const fetchSuppliersApi = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/suppliers`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch suppliers');
  return response.json();
};

export const addSupplierApi = async (token: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/suppliers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add supplier');
  return response.json();
};

export const deleteSupplierApi = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to delete supplier');
  return response.json();
};

export const updateSupplierApi = async (token: string, id: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update supplier');
  return response.json();
};
