import apiClient from "../apiClient";

export async function fetchCategoryTree() {
  const endpoint = "category-trees";
  try {
    const response = await apiClient.get(endpoint, "");
    return response;
  } catch (error: any) {
    console.error("Error fetching category trees:", error.message);
  }
}

export async function fetchCatalogSearchSuggestions(searchQuery: any) {
  const endpoint = `catalog-search-suggestions?q=${searchQuery}&include=abstract-products%2Cconcrete-products%2F`;
  try {
    const response = await apiClient.get(endpoint, "");
    return response;
  } catch (error: any) {
    console.error("Error fetching category trees:", error.message);
  }
}

export async function fetchCatalogSearchByCategory(nodeId: any, queryString:any, val:any) {
    const endpoint = `catalog-search?category=${nodeId}&include=abstract-products&${queryString}${val}`;
    try {
      const response = await apiClient.get(endpoint, "");
      return response;
    } catch (error: any) {
      console.error("Error fetching category trees:", error.message);
    }
  }

