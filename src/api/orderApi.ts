import { API_BASE_URL } from './config';

export const fetchAllOrdersApi = async (token: string, status?: string) => {
  const url = status ? `${API_BASE_URL}/orders/all?status=${status}` : `${API_BASE_URL}/orders/all`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch all orders');
  return response.json();
};

export const fetchMyOrdersApi = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/orders/my`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch my orders');
  return response.json();
};

export const updateOrderStatusApi = async (token: string, id: string, statusData: { status: string, pickupLocation?: string, dropoffLocation?: string }) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(statusData),
  });
  if (!response.ok) throw new Error('Failed to update order status');
  return response.json();
};

export const fetchOrderByIdApi = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch order details');
  return response.json();
};

export const placeOrderApi = async (token: string, orderData: any) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error('Failed to place order');
  return response.json();
};

export const fetchChefStatsApi = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/orders/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch chef stats');
  return response.json();
};
