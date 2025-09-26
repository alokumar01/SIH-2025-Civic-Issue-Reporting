import api from '../api';

const API_BASE_URL = '/v1/employees';

export const employeeService = {
  async createEmployee(employeeData) {
    try {
      const response = await api.post(API_BASE_URL, employeeData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  async getEmployees(page = 1, limit = 25, filters = {}) {
    console.log("first")
    try {
      const params = {
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      };
      
      const response = await api.get(API_BASE_URL, { params });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  async updateEmployee(employeeId, updateData) {
    try {
      const response = await api.put(`${API_BASE_URL}/${employeeId}`, updateData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  async deleteEmployee(employeeId) {
    try {
      const response = await api.delete(`${API_BASE_URL}/${employeeId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },

  async getEmployeeById(employeeId) {
    try {
      const response = await api.get(`${API_BASE_URL}/${employeeId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }
};