import apiClient from "../apiClient";

var token:any;
if (typeof window !== "undefined") {
  token = localStorage.getItem("token");
}

export async function fetchCustomerBasicDetails() {
    const endpoint = `customers`;
    try {
      const response = await apiClient.getPrivate(endpoint, "",token);
      return response;
    } catch (error: any) {
      console.error("Error fetching category trees:", error.message);
    }
  }

  export async function updateCustomerDetails(data:any, userId:any){
    const endpoint = `customers/${userId}`;
    try {
      const response:any = await apiClient.patchPrivate(endpoint, data,token);
      return response;
    } catch (error: any) {
      console.error("Error Updting Customer Detail", error.message);
    }
  }

  export async function updateCustomerPassword(data:any, userId:any){
    const endpoint = `customer-password/${userId}`;
    try {
      const response:any = await apiClient.patchPrivate(endpoint, data,token);
      return response;
    } catch (error: any) {
      console.error("Error Updting Customer Password:", error.message);
    }
  }