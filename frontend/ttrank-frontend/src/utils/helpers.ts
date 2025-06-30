export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const downloadCSVTemplate = (): void => {
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

export const validateCSVFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
    return { isValid: false, error: 'Please select a CSV file' };
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    return { isValid: false, error: 'File size must be less than 5MB' };
  }
  
  return { isValid: true };
};

export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.response?.data) {
    const data = error.response.data;
    if (typeof data === 'string') {
      return data;
    }
    if (data.detail) {
      return data.detail;
    }
    if (data.message) {
      return data.message;
    }
    if (data.error) {
      return data.error;
    }
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};