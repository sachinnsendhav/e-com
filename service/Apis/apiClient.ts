import { API_URL } from "../../config";

class ApiClient {
  async get(endpoint: any, queryParams:any) {
    const url = new URL(endpoint, API_URL);

    Object.keys(queryParams).forEach((key) => {
      url.searchParams.append(key, queryParams[key]);
    });

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error:any) {
      throw new Error(`Failed to fetch ${url.toString()}: ${error.message}`);
    }
  }

  async post(endpoint:any, data:any) {
    const url = new URL(endpoint, API_URL);

    try {
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error:any) {
      throw new Error(`Failed to fetch ${url.toString()}: ${error.message}`);
    }
  }

  async put(endpoint:any, data:any) {
    const url = new URL(endpoint, API_URL);

    try {
      const response = await fetch(url.toString(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw new Error(`Failed to fetch ${url.toString()}: ${error.message}`);
    }
  }

  async delete(endpoint:any) {
    const url = new URL(endpoint, API_URL);

    try {
      const response = await fetch(url.toString(), {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error:any) {
      throw new Error(`Failed to fetch ${url.toString()}: ${error.message}`);
    }
  }

  async patch(endpoint:any, data:any) {
    const url = new URL(endpoint, API_URL);

    try {
      const response = await fetch(url.toString(), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error:any) {
      throw new Error(`Failed to fetch ${url.toString()}: ${error.message}`);
    }
  }

}

const apiClient = new ApiClient();
export default apiClient;
