import apiClient from "../apiClient";
var token:any;

if (typeof window !== "undefined") {
  // Code running in the browser
  token = localStorage.getItem("token");
}

export async function fetchShoppingListItems(shoppingListId: any) {
    const endpoint = `shopping-lists/${shoppingListId}?include=shopping-list-items`;
    try {
      const response = await apiClient.getPrivate(endpoint, "",token);
      return response;
    } catch (error: any) {
      console.error("Error fetching category trees:", error.message);
    }
  }