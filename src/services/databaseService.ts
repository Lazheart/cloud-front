import axios from 'axios';
import config from '../config/env';
import { mockCinemas } from './mockData';

// Types for SQLite operations
export interface DatabaseStatus {
  Status: string;
  db_path: string;
}

export interface CreateRequest {
  table: string;
  Document: Record<string, any>;
}

export interface CreateResponse {
  Status: string;
  rowid: number;
}

export interface ListRequest {
  table: string;
}

export interface UpdateRequest {
  table: string;
  Filter: Record<string, any>;
  DataToBeUpdated: Record<string, any>;
}

export interface DeleteRequest {
  table: string;
  Filter: Record<string, any>;
}

export interface ServiceError {
  message: string;
  status: number;
  details?: any;
}

// Service response type
export interface ServiceResponse<T> {
  data: T | null;
  error: ServiceError | null;
}

/**
 * Database Service
 * Handles SQLite database operations through REST API
 */
export class DatabaseService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.api.databaseService;
  }

  /**
   * Check database service status
   * @returns ServiceResponse with database status
   */
  async checkStatusService(): Promise<ServiceResponse<DatabaseStatus>> {
    try {
      const response = await axios.get(`${this.baseURL}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000, // 5 second timeout
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      // If network error or timeout, return mock status for development
      if (error.code === 'ERR_NAME_NOT_RESOLVED' || 
          error.code === 'ERR_NETWORK' || 
          error.code === 'ECONNABORTED' ||
          error.message?.includes('timeout')) {
        console.warn('Database service unavailable, using mock status');
        return {
          data: { Status: 'UP', db_path: '/mnt/theaters/theaters.db' },
          error: null,
        };
      }

      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to check database status',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      return {
        data: null,
        error: serviceError,
      };
    }
  }

  /**
   * Create a new record in the database
   * @param createData - Data for creating the record
   * @returns ServiceResponse with creation result
   */
  async createRecordService(createData: CreateRequest): Promise<ServiceResponse<CreateResponse>> {
    try {
      const response = await axios.post(`${this.baseURL}/sqlite`, createData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to create record',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      return {
        data: null,
        error: serviceError,
      };
    }
  }

  /**
   * List records from a table
   * @param listData - Table name to list records from
   * @returns ServiceResponse with array of records
   */
  async listRecordsService(listData: ListRequest): Promise<ServiceResponse<any[]>> {
    try {
      const response = await axios.get(`${this.baseURL}/sqlite`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: listData,
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to list records',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      return {
        data: null,
        error: serviceError,
      };
    }
  }

  /**
   * Update a record in the database
   * @param updateData - Data for updating the record
   * @returns ServiceResponse with update result
   */
  async updateRecordService(updateData: UpdateRequest): Promise<ServiceResponse<{ Status: string }>> {
    try {
      const response = await axios.put(`${this.baseURL}/sqlite`, updateData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to update record',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      return {
        data: null,
        error: serviceError,
      };
    }
  }

  /**
   * Delete a record from the database
   * @param deleteData - Data for deleting the record
   * @returns ServiceResponse with deletion result
   */
  async deleteRecordService(deleteData: DeleteRequest): Promise<ServiceResponse<{ Status: string }>> {
    try {
      const response = await axios.delete(`${this.baseURL}/sqlite`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: deleteData,
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to delete record',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      return {
        data: null,
        error: serviceError,
      };
    }
  }

  /**
   * Create a cinema record
   * @param cinemaData - Cinema data
   * @returns ServiceResponse with creation result
   */
  async createCinemaService(cinemaData: {
    nombre: string;
    ciudad: string;
    distrito: string;
  }): Promise<ServiceResponse<CreateResponse>> {
    return this.createRecordService({
      table: 'cinemas',
      Document: cinemaData,
    });
  }

  /**
   * List all cinemas
   * @returns ServiceResponse with array of cinemas
   */
  async listCinemasService(): Promise<ServiceResponse<any[]>> {
    try {
      const response = await this.listRecordsService({ table: 'cinemas' });
      return response;
    } catch (error: any) {
      // If network error or timeout, return mock data for development
      if (error.code === 'ERR_NAME_NOT_RESOLVED' || 
          error.code === 'ERR_NETWORK' || 
          error.code === 'ECONNABORTED' ||
          error.message?.includes('timeout')) {
        console.warn('Database service unavailable, using mock cinemas');
        return {
          data: mockCinemas,
          error: null,
        };
      }
      throw error;
    }
  }

  /**
   * Update a cinema record
   * @param cinemaId - ID of the cinema to update
   * @param updateData - Data to update
   * @returns ServiceResponse with update result
   */
  async updateCinemaService(
    cinemaId: number,
    updateData: Record<string, any>
  ): Promise<ServiceResponse<{ Status: string }>> {
    return this.updateRecordService({
      table: 'cinemas',
      Filter: { id: cinemaId },
      DataToBeUpdated: updateData,
    });
  }

  /**
   * Delete a cinema record
   * @param cinemaId - ID of the cinema to delete
   * @returns ServiceResponse with deletion result
   */
  async deleteCinemaService(cinemaId: number): Promise<ServiceResponse<{ Status: string }>> {
    return this.deleteRecordService({
      table: 'cinemas',
      Filter: { id: cinemaId },
    });
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();

// Export individual functions for convenience
export const checkStatusService = () => databaseService.checkStatusService();
export const createRecordService = (data: CreateRequest) => databaseService.createRecordService(data);
export const listRecordsService = (data: ListRequest) => databaseService.listRecordsService(data);
export const updateRecordService = (data: UpdateRequest) => databaseService.updateRecordService(data);
export const deleteRecordService = (data: DeleteRequest) => databaseService.deleteRecordService(data);
export const createCinemaService = (data: { nombre: string; ciudad: string; distrito: string }) => databaseService.createCinemaService(data);
export const listCinemasService = () => databaseService.listCinemasService();
export const updateCinemaService = (id: number, data: Record<string, any>) => databaseService.updateCinemaService(id, data);
export const deleteCinemaService = (id: number) => databaseService.deleteCinemaService(id);
