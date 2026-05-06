import { apiClient } from "@/lib/apiClient";

export interface Address {
  _id: string;
  userId: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  label?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressPayload {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
  label?: string;
}

export async function getAddresses(): Promise<Address[]> {
  const response = await apiClient<Address[]>("/addresses", {
    method: "GET",
  });
  if (!response.data) return [];
  return response.data;
}

export async function createAddress(payload: CreateAddressPayload): Promise<Address> {
  const response = await apiClient<Address>("/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.data) throw new Error("Failed to create address");
  return response.data;
}

export async function updateAddress(addressId: string, payload: Partial<CreateAddressPayload>): Promise<Address> {
  const response = await apiClient<Address>(`/addresses/${addressId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!response.data) throw new Error("Failed to update address");
  return response.data;
}

export async function deleteAddress(addressId: string): Promise<boolean> {
  const response = await apiClient<{ deleted: boolean }>(`/addresses/${addressId}`, {
    method: "DELETE",
  });
  return !!response.data?.deleted;
}

export async function setDefaultAddress(addressId: string): Promise<Address> {
  const response = await apiClient<Address>(`/addresses/${addressId}/default`, {
    method: "PATCH",
  });
  if (!response.data) throw new Error("Failed to set default address");
  return response.data;
}