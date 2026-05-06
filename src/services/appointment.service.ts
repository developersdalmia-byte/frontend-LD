import { apiClient } from "../lib/apiClient";

export interface Store {
  _id: string;
  name: string;
  code: string;
  address: string;
  isActive: boolean;
}

export interface AppointmentPayload {
  customerName: string;
  email: string;
  phoneNumber: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  storeId: string;
  source: "ONLINE";
}

export interface AppointmentResponse {
  type: "NEW" | "RESUME" | "REPEAT";
  message?: string;
  appointment: {
    _id: string;
    phoneNumber: string;
    customerName: string;
    email: string;
    status: string;
    entryType: string;
    storeId: {
      _id: string;
      name: string;
      code: string;
      address: string;
    };
    requestedDateTime: string;
  };
}

export const getPublicStores = async (): Promise<Store[]> => {
  const response = await apiClient<Store[]>("/stores/public", { method: "GET" });
  return response.data || [];
};

export const initiateAppointment = async (payload: AppointmentPayload): Promise<AppointmentResponse> => {
  const response = await apiClient<AppointmentResponse>("/appointments/initiate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  
  if (!response.data) {
    throw new Error(response.message || "Failed to initiate appointment");
  }
  
  return response.data;
};
