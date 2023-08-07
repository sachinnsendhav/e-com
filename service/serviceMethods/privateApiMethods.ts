import {
  fetchCustomerBasicDetails,
  updateCustomerDetails,
  updateCustomerPassword,
} from "../Apis/privateApis/userApis";

export async function fetchCustomerBasicDetailsMethod() {
  const tempdata = await fetchCustomerBasicDetails();
  return tempdata?.data[0];
}

export async function updateCustomerDetailsMethod(data: any, userId: any) {
  const tempdata = await updateCustomerDetails(data, userId);
  return tempdata;
}

export async function updateCustomerPasswordMethod(data: any, userId: any) {
  const tempdata = await updateCustomerPassword(data, userId);
  return tempdata;
}
