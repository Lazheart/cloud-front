import React, { useState, useEffect } from 'react';
import { useDatabase } from '../hooks/useDatabase';

/**
 * Example component showing how to use the database hook
 * This demonstrates all CRUD operations with the SQLite service
 */
export const DatabaseExample: React.FC = () => {
  const { 
    data, 
    loading, 
    error, 
    status, 
    handleCheckStatus, 
    handleCreateCinema, 
    handleListCinemas, 
    handleUpdateCinema, 
    handleDeleteCinema, 
    clearError, 
    refreshData 
  } = useDatabase();

  // Form states
  const [cinemaForm, setCinemaForm] = useState({ 
    nombre: '', 
    ciudad: '', 
    distrito: '' 
  });
  const [updateForm, setUpdateForm] = useState({ 
    id: '', 
    field: 'distrito', 
    value: '' 
  });
  const [deleteForm, setDeleteForm] = useState({ id: '' });

  // Load cinemas on mount
  useEffect(() => {
    handleListCinemas();
  }, []);

  // Handle cinema creation
  const handleCinemaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCreateCinema(cinemaForm);
    setCinemaForm({ nombre: '', ciudad: '', distrito: '' });
    // Refresh the list after creation
    setTimeout(() => handleListCinemas(), 1000);
  };

  // Handle cinema update
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(updateForm.id);
    if (!isNaN(id)) {
      await handleUpdateCinema(id, { [updateForm.field]: updateForm.value });
      setUpdateForm({ id: '', field: 'distrito', value: '' });
      // Refresh the list after update
      setTimeout(() => handleListCinemas(), 1000);
    }
  };

  // Handle cinema deletion
  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(deleteForm.id);
    if (!isNaN(id)) {
      await handleDeleteCinema(id);
      setDeleteForm({ id: '' });
      // Refresh the list after deletion
      setTimeout(() => handleListCinemas(), 1000);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#e66414', textAlign: 'center' }}>Database Management Example</h1>
      
      {/* Database Status */}
      {status && (
        <div style={{ 
          padding: '15px', 
          margin: '10px 0', 
          backgroundColor: status.Status === 'UP' ? '#d4edda' : '#f8d7da',
          border: `1px solid ${status.Status === 'UP' ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          <strong>Database Status:</strong> {status.Status}
          <br />
          <strong>Database Path:</strong> {status.db_path}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{ 
          padding: '10px', 
          margin: '10px 0', 
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24'
        }}>
          <strong>Error:</strong> {error.message}
          <button 
            onClick={clearError}
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: '#e66414' }}>Loading...</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Create Cinema Form */}
        <div>
          <h2 style={{ color: '#e66414' }}>Create Cinema</h2>
          <form onSubmit={handleCinemaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                value={cinemaForm.nombre}
                onChange={(e) => setCinemaForm({ ...cinemaForm, nombre: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                required
              />
            </div>
            <div>
              <label>Ciudad:</label>
              <input
                type="text"
                value={cinemaForm.ciudad}
                onChange={(e) => setCinemaForm({ ...cinemaForm, ciudad: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                required
              />
            </div>
            <div>
              <label>Distrito:</label>
              <input
                type="text"
                value={cinemaForm.distrito}
                onChange={(e) => setCinemaForm({ ...cinemaForm, distrito: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                backgroundColor: '#e66414', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating...' : 'Create Cinema'}
            </button>
          </form>
        </div>

        {/* Update Cinema Form */}
        <div>
          <h2 style={{ color: '#e66414' }}>Update Cinema</h2>
          <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label>Cinema ID:</label>
              <input
                type="number"
                value={updateForm.id}
                onChange={(e) => setUpdateForm({ ...updateForm, id: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                required
              />
            </div>
            <div>
              <label>Field to Update:</label>
              <select
                value={updateForm.field}
                onChange={(e) => setUpdateForm({ ...updateForm, field: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="nombre">Nombre</option>
                <option value="ciudad">Ciudad</option>
                <option value="distrito">Distrito</option>
              </select>
            </div>
            <div>
              <label>New Value:</label>
              <input
                type="text"
                value={updateForm.value}
                onChange={(e) => setUpdateForm({ ...updateForm, value: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                backgroundColor: '#e66414', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Updating...' : 'Update Cinema'}
            </button>
          </form>
        </div>
      </div>

      {/* Delete Cinema Form */}
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ color: '#e66414' }}>Delete Cinema</h2>
        <form onSubmit={handleDeleteSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
          <div style={{ flex: 1 }}>
            <label>Cinema ID:</label>
            <input
              type="number"
              value={deleteForm.id}
              onChange={(e) => setDeleteForm({ id: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              backgroundColor: '#dc3545', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Deleting...' : 'Delete Cinema'}
          </button>
        </form>
      </div>

      {/* Cinemas List */}
      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ color: '#e66414', margin: 0 }}>Cinemas List</h2>
          <button 
            onClick={handleListCinemas}
            disabled={loading}
            style={{ 
              backgroundColor: '#28a745', 
              color: 'white', 
              padding: '8px 16px', 
              border: 'none', 
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Loading...' : 'Refresh List'}
          </button>
        </div>
        
        {Array.isArray(data) && data.length > 0 ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {data.map((cinema: any, index: number) => (
              <div 
                key={cinema.id || index} 
                style={{ 
                  padding: '15px', 
                  backgroundColor: '#f8f9fa', 
                  border: '1px solid #dee2e6', 
                  borderRadius: '4px' 
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <strong>ID:</strong> {cinema.id}
                  </div>
                  <div>
                    <strong>Nombre:</strong> {cinema.nombre}
                  </div>
                  <div>
                    <strong>Ciudad:</strong> {cinema.ciudad}
                  </div>
                  <div>
                    <strong>Distrito:</strong> {cinema.distrito}
                  </div>
                  <div>
                    <strong>Nro Salas:</strong> {cinema.nro_salas || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #dee2e6', 
            borderRadius: '4px' 
          }}>
            {loading ? 'Loading cinemas...' : 'No cinemas found'}
          </div>
        )}
      </div>

      {/* Database Operations */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button 
          onClick={handleCheckStatus}
          disabled={loading}
          style={{ 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Checking...' : 'Check Database Status'}
        </button>
        <button 
          onClick={refreshData}
          disabled={loading}
          style={{ 
            backgroundColor: '#6c757d', 
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Refreshing...' : 'Refresh All Data'}
        </button>
      </div>
    </div>
  );
};
