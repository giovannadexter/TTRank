import { useState } from 'react';
import AthleteForm from './AthleteForm';
import CSVImport from './CSVImport';
import { useAthletes } from '../hooks/useAthletes';
import type { Athlete } from '../types/athlete';
import { formatDate } from '../utils/helpers';

const AthleteList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | undefined>();
  
  const { 
    athletes, 
    loading, 
    error, 
    deleteAthlete, 
    fetchAthletes,
    exportCSV 
  } = useAthletes();

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this athlete?')) {
      return;
    }

    const result = await deleteAthlete(id);
    if (!result.success) {
      console.error('Delete failed:', result.error);
    }
  };

  const handleEdit = (athlete: Athlete) => {
    setEditingAthlete(athlete);
    setShowForm(true);
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setEditingAthlete(undefined);
    await fetchAthletes();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAthlete(undefined);
  };

  const handleCSVImportComplete = async () => {
    setShowCSVImport(false);
    await fetchAthletes();
  };

  const handleCSVImportCancel = () => {
    setShowCSVImport(false);
  };

  const handleExport = async () => {
    const result = await exportCSV();
    if (!result.success) {
      console.error('Export failed:', result.error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading athletes...</div>
      </div>
    );
  }

  if (showForm) {
    return (
      <AthleteForm
        athlete={editingAthlete}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  if (showCSVImport) {
    return (
      <CSVImport
        onImportComplete={handleCSVImportComplete}
        onCancel={handleCSVImportCancel}
      />
    );
  }

  return (
    <div className="p-6 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Atletas</h1>
            <p className="text-neutral-600">Gerencie os atletas do torneio</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              className="bg-white border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              📊 Exportar CSV
            </button>
            <button
              onClick={() => setShowCSVImport(true)}
              className="bg-white border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              📥 Importar CSV
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-400 text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors"
            >
              + Adicionar Atleta
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {athletes.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-card">
            <div className="text-neutral-500 text-lg mb-4">Nenhum atleta encontrado</div>
            <p className="text-neutral-400 mb-6">Comece adicionando seu primeiro atleta ao sistema</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-400 text-neutral-900 px-6 py-3 rounded-lg font-medium hover:bg-primary-500 transition-colors"
            >
              Adicionar Primeiro Atleta
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            {/* Search Bar */}
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Pesquisar por jogadores, clubes..."
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
                <div className="ml-4 text-sm text-neutral-600">
                  {athletes.length} atletas
                </div>
              </div>
            </div>

            {/* Athletes Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(athletes) && athletes.map((athlete) => (
                  <div
                    key={athlete.id}
                    className="bg-neutral-50 rounded-lg p-4 hover:bg-neutral-100 transition-colors border border-neutral-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900 mb-1">
                          {athlete.full_name}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {athlete.club || 'Sem clube'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEdit(athlete)}
                          className="text-neutral-600 hover:text-primary-600 p-1"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => athlete.id && handleDelete(athlete.id)}
                          className="text-neutral-600 hover:text-red-600 p-1"
                          title="Excluir"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Pontos:</span>
                        <span className="font-medium text-neutral-900">
                          {athlete.ranking_points}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Nascimento:</span>
                        <span className="text-neutral-900">
                          {formatDate(athlete.birth_date)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Telefone:</span>
                        <span className="text-neutral-900">
                          {athlete.phone_number}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AthleteList;