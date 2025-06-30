import { useState, useEffect } from 'react';
import type { Athlete } from '../types/athlete';
import { api } from '../services/api';

export const useAthletes = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchAthletes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.athletes.list();
      console.log('API Response:', response.data);
      
      // Handle paginated response - type the response properly
      const responseData = response.data as any;
      const athletesData = responseData?.results || responseData || [];
      setAthletes(Array.isArray(athletesData) ? athletesData : []);
    } catch (err: any) {
      console.error('Fetch athletes error:', err);
      setError(err.response?.data?.message || 'Failed to fetch athletes');
      setAthletes([]); // Ensure athletes is always an array
    } finally {
      setLoading(false);
    }
  };

  const createAthlete = async (athleteData: Omit<Athlete, 'id'>) => {
    try {
      const response = await api.athletes.create(athleteData);
      setAthletes(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create athlete';
      return { success: false, error: message };
    }
  };

  const updateAthlete = async (id: number, athleteData: Partial<Athlete>) => {
    try {
      const response = await api.athletes.update(id, athleteData);
      setAthletes(prev => prev.map(athlete => 
        athlete.id === id ? response.data : athlete
      ));
      return { success: true, data: response.data };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update athlete';
      return { success: false, error: message };
    }
  };

  const deleteAthlete = async (id: number) => {
    try {
      await api.athletes.delete(id);
      setAthletes(prev => prev.filter(athlete => athlete.id !== id));
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete athlete';
      return { success: false, error: message };
    }
  };

  const importCSV = async (file: File) => {
    try {
      const response = await api.athletes.importCSV(file);
      await fetchAthletes(); // Refresh the list
      return { success: true, data: response.data };
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to import CSV';
      return { success: false, error: message };
    }
  };

  const exportCSV = async () => {
    try {
      const response = await api.athletes.exportCSV();
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'athletes_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to export CSV';
      return { success: false, error: message };
    }
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  return {
    athletes,
    loading,
    error,
    fetchAthletes,
    createAthlete,
    updateAthlete,
    deleteAthlete,
    importCSV,
    exportCSV
  };
};