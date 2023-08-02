
import apiClient from '../apiClient';

export async function fetchCategoryTree() {
  const endpoint = 'category-trees';
  try {
    const response = await apiClient.get(endpoint,null);
    return response;
  } catch (error:any) {
    console.error('Error fetching category trees:', error.message);
  }
}