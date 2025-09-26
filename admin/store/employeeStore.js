import { create } from 'zustand'
import api from '@/lib/api'

export const useEmployeeStore = create((set, get) => ({
  employees: [],
  totalPages: 1,
  totalCount: 0,
  isLoading: false,
  error: null,

  // Fetch employees with filters
  fetchEmployees: async (filters) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.get('/v1/employees', { params: filters })
      set({ 
        employees: response.data.data,
        totalPages: Math.ceil(response.data.total / filters.limit),
        totalCount: response.data.total,
        isLoading: false
      })
    } catch (error) {
      set({ 
        error: error?.response?.data?.message || 'Failed to fetch employees',
        isLoading: false 
      })
    }
  },

  // Create new employee
  createEmployee: async (data) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.post('/v1/employees', data)
      set((state) => ({
        employees: [response.data.data, ...state.employees],
        isLoading: false
      }))
      return response.data
    } catch (error) {
      set({ 
        error: error?.response?.data?.message || 'Failed to create employee',
        isLoading: false 
      })
      throw error
    }
  },

  // Update employee
  updateEmployee: async (id, data) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.put(`/v1/employees/${id}`, data)
      set((state) => ({
        employees: state.employees.map(emp => 
          emp._id === id ? response.data.data : emp
        ),
        isLoading: false
      }))
      return response.data
    } catch (error) {
      set({ 
        error: error?.response?.data?.message || 'Failed to update employee',
        isLoading: false 
      })
      throw error
    }
  },

  // Deactivate employee
  deactivateEmployee: async (id) => {
    try {
      set({ isLoading: true, error: null })
      await api.delete(`/v1/employees/${id}`)
      set((state) => ({
        employees: state.employees.map(emp => 
          emp._id === id ? { ...emp, isActive: false } : emp
        ),
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error?.response?.data?.message || 'Failed to deactivate employee',
        isLoading: false 
      })
      throw error
    }
  },
}))