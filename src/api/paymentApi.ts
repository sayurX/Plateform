import { API_BASE_URL } from './config';

export const fetchPaymentMethodsApi = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/user/payments`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch payment methods');
  return response.json();
};

export const addPaymentMethodApi = async (token: string, paymentMethod: any) => {
  const response = await fetch(`${API_BASE_URL}/user/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(paymentMethod),
  });
  if (!response.ok) throw new Error('Failed to add payment method');
  return response.json();
};

export const removePaymentMethodApi = async (token: string, paymentMethodId: string) => {
  const response = await fetch(`${API_BASE_URL}/user/payments/${paymentMethodId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to remove payment method');
  return response.json();
};
