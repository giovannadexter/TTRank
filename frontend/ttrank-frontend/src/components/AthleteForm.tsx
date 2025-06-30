import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:8000';

interface Athlete {
  id?: number;
  full_name: string;
  birth_date: string;
  phone_number: string;
  ranking_points: number;
  club?: string;
}

interface AthleteFormProps {
  athlete?: Athlete;
  onSubmit: () => void;
  onCancel: () => void;
}

const AthleteForm: React.FC<AthleteFormProps> = ({ athlete, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Athlete>({
    full_name: '',
    birth_date: '',
    phone_number: '',
    ranking_points: 0,
    club: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (athlete) {
      setFormData(athlete);
    }
  }, [athlete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ranking_points' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      
      // If no token, create a temporary one for testing
      if (!token) {
        setError('No authentication token found. For testing, you can create a superuser and get a token from Django admin.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      let response;
      if (athlete?.id) {
        response = await axios.put(`/api/athletes/${athlete.id}/`, formData, config);
      } else {
        response = await axios.post('/api/athletes/', formData, config);
      }

      console.log('Success:', response.data);
      onSubmit();
    } catch (err: any) {
      console.error('Error details:', err.response?.data);
      console.error('Full error:', err);
      
      let errorMessage = 'An error occurred';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed - invalid token';
      } else if (err.response?.status === 403) {
        errorMessage = 'Permission denied';
      } else if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-neutral-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-card p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              {athlete?.id ? 'Editar Atleta' : 'Adicionar Novo Atleta'}
            </h2>
            <p className="text-neutral-600">
              Preencha as informações do atleta abaixo
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Digite o nome completo do atleta"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Pontos de Ranking *
                </label>
                <input
                  type="number"
                  name="ranking_points"
                  value={formData.ranking_points}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Clube
              </label>
              <input
                type="text"
                name="club"
                value={formData.club || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Nome do clube (opcional)"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-400 text-neutral-900 px-6 py-3 rounded-lg font-medium hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Salvando...' : (athlete?.id ? 'Atualizar Atleta' : 'Adicionar Atleta')}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AthleteForm;