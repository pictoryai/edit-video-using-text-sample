import axios from "axios";

const ApiService = {
  get: async (url, config = {}) => {
    try {
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      console.error("Error in GET request:", error);
      throw error;
    }
  },

  post: async (url, data, config = {}) => {
    try {
      const response = await axios.post(url, data, config);
      return response.data;
    } catch (error) {
      console.error("Error in POST request:", error);
      throw error;
    }
  },
};

export default ApiService;
