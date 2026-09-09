import { API_BASE_URL } from './config';

export const fetchAddressesApi = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/user/addresses`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch addresses');
  return response.json();
};

export const addAddressApi = async (token: string, address: any) => {
  const response = await fetch(`${API_BASE_URL}/user/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });
  if (!response.ok) throw new Error('Failed to add address');
  return response.json();
};

export const deleteAddressApi = async (token: string, addressId: string) => {
  const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete address');
  return response.json();
};

export const updateAddressApi = async (token: string, addressId: string, addressData: any) => {
  const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  });
  if (!response.ok) throw new Error('Failed to update address');
  return response.json();
};
