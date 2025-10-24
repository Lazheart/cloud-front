import { useState, useEffect } from 'react';
import { databaseService } from '../services/databaseService';
import type { 
  DatabaseStatus, 
  CreateRequest as DatabaseCreateRequest, 
  ListRequest, 
  UpdateRequest, 
  DeleteRequest, 
  ServiceError 
} from '../services/databaseService';

// Hook state interface
export interface UseDatabaseState {
  data: any;
  loading: boolean;
  error: ServiceError | null;
  status: DatabaseStatus | null;
}

// Hook return interface
export interface UseDatabaseReturn extends UseDatabaseState {
  handleCheckStatus: () => Promise<void>;
  handleCreateRecord: (data: DatabaseCreateRequest) => Promise<void>;
  handleListRecords: (data: ListRequest) => Promise<void>;
  handleUpdateRecord: (data: UpdateRequest) => Promise<void>;
  handleDeleteRecord: (data: DeleteRequest) => Promise<void>;
  handleCreateCinema: (data: { nombre: string; ciudad: string; distrito: string }) => Promise<void>;
  handleListCinemas: () => Promise<void>;
  handleUpdateCinema: (id: number, data: Record<string, any>) => Promise<void>;
  handleDeleteCinema: (id: number) => Promise<void>;
  clearError: () => void;
  refreshData: () => Promise<void>;
}

/**
 * Database Management Hook
 * Manages database operations and state
 */
export const useDatabase = (): UseDatabaseReturn => {
  const [state, setState] = useState<UseDatabaseState>({
    data: null,
    loading: false,
    error: null,
    status: null,
  });

  // Check database status on mount
  useEffect(() => {
    const checkStatus = async () => {
      await handleCheckStatus();
    };

    checkStatus();
  }, []);

  /**
   * Check database service status
   */
  const handleCheckStatus = async (): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await databaseService.checkStatusService();
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        status: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error checking database status',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Create a new record
   * @param data - Record creation data
   */
  const handleCreateRecord = async (data: DatabaseCreateRequest): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await databaseService.createRecordService(data);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error creating record',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * List records from a table
   * @param data - Table name to list records from
   */
  const handleListRecords = async (data: ListRequest): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await databaseService.listRecordsService(data);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error listing records',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Update a record
   * @param data - Record update data
   */
  const handleUpdateRecord = async (data: UpdateRequest): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await databaseService.updateRecordService(data);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error updating record',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Delete a record
   * @param data - Record deletion data
   */
  const handleDeleteRecord = async (data: DeleteRequest): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await databaseService.deleteRecordService(data);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error deleting record',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Create a cinema record
   * @param data - Cinema data
   */
  const handleCreateCinema = async (data: { nombre: string; ciudad: string; distrito: string }): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await databaseService.createCinemaService(data);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error creating cinema',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * List all cinemas
   */
  const handleListCinemas = async (): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await databaseService.listCinemasService();
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error listing cinemas',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Update a cinema record
   * @param id - Cinema ID
   * @param data - Data to update
   */
  const handleUpdateCinema = async (id: number, data: Record<string, any>): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await databaseService.updateCinemaService(id, data);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error updating cinema',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Delete a cinema record
   * @param id - Cinema ID
   */
  const handleDeleteCinema = async (id: number): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await databaseService.deleteCinemaService(id);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error deleting cinema',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Clear error state
   */
  const clearError = (): void => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  };

  /**
   * Refresh data by checking status
   */
  const refreshData = async (): Promise<void> => {
    await handleCheckStatus();
  };

  return {
    ...state,
    handleCheckStatus,
    handleCreateRecord,
    handleListRecords,
    handleUpdateRecord,
    handleDeleteRecord,
    handleCreateCinema,
    handleListCinemas,
    handleUpdateCinema,
    handleDeleteCinema,
    clearError,
    refreshData,
  };
};
