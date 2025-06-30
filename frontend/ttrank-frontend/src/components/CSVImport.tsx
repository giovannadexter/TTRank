import React, { useState } from 'react';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:8000';

interface CSVImportProps {
  onImportComplete: () => void;
  onCancel: () => void;
}

interface ImportResult {
  message: string;
  created_athletes: string[];
  errors: string[];
  total_processed: number;
  successful: number;
  failed: number;
}

const CSVImport: React.FC<CSVImportProps> = ({ onImportComplete, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('accessToken');
      const response = await axios.post('/api/athletes/import_csv/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data);
    } catch (err: any) {
      console.error('Import error:', err);
      let errorMessage = 'Import failed';
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    onImportComplete();
  };

  const downloadTemplate = () => {
    const csvContent = 'full_name,birth_date,phone_number,ranking_points,club\n' +
                      'John Doe,1990-01-15,+1234567890,1500,City Club\n' +
                      'Jane Smith,1985-03-22,+0987654321,1800,Sports Center\n' +
                      'Mike Johnson,1992-07-08,+1122334455,1200,';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'athletes_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Import Athletes from CSV</h2>
      
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
          <h3 className="font-medium text-blue-900 mb-2">CSV Format Requirements:</h3>
          <p className="text-sm text-blue-700 mb-2">
            Your CSV file should have the following columns (in order):
          </p>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            <li><strong>full_name</strong> - Required</li>
            <li><strong>birth_date</strong> - Required (YYYY-MM-DD format)</li>
            <li><strong>phone_number</strong> - Required</li>
            <li><strong>ranking_points</strong> - Required (number)</li>
            <li><strong>club</strong> - Optional</li>
          </ul>
          <button
            onClick={downloadTemplate}
            className="mt-3 text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Download Template CSV
          </button>
        </div>
      </div>

      {!result && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleImport}
              disabled={!file || loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Importing...' : 'Import Athletes'}
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <h3 className="font-medium">{result.message}</h3>
            <p className="text-sm mt-1">
              Processed: {result.total_processed} | 
              Successful: {result.successful} | 
              Failed: {result.failed}
            </p>
          </div>

          {result.created_athletes.length > 0 && (
            <div>
              <h4 className="font-medium text-green-700 mb-2">Successfully Created Athletes:</h4>
              <ul className="text-sm text-green-600 list-disc list-inside max-h-32 overflow-y-auto">
                {result.created_athletes.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
          )}

          {result.errors.length > 0 && (
            <div>
              <h4 className="font-medium text-red-700 mb-2">Errors:</h4>
              <ul className="text-sm text-red-600 list-disc list-inside max-h-32 overflow-y-auto">
                {result.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleComplete}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Done
            </button>
            <button
              onClick={() => {
                setResult(null);
                setFile(null);
                setError('');
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Import Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVImport;