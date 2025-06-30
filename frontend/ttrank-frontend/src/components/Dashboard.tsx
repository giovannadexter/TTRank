import { useAthletes } from '../hooks/useAthletes';

const Dashboard: React.FC = () => {
  const { athletes } = useAthletes();

  const stats = [
    {
      title: 'Total de Atletas',
      value: athletes.length.toString(),
      icon: '👥',
    },
    {
      title: 'Total de Categorias',
      value: '6',
      icon: '🏆',
    },
    {
      title: 'Total de Partidas',
      value: '350',
      icon: '🏓',
    },
    {
      title: 'Total de Mesas',
      value: '8',
      icon: '⚡',
    },
  ];

  const recentParticipants = [
    { name: 'Giovanna Missaki Kubo', club: 'ACER' },
    { name: 'Nicolas Berbert', club: 'Cianorte Fodase' },
    { name: 'Adilson Ossamu Kubo', club: 'ACER' },
    { name: 'João Silva', club: 'Clube Central' },
    { name: 'Maria Santos', club: 'Esporte Total' },
  ];

  return (
    <div className="p-6 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Painel de Controle do Torneio
          </h1>
          <p className="text-neutral-600">
            Visão geral dos seus torneios e atletas
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-neutral-900">
                    {stat.value}
                  </p>
                </div>
                <div className="text-2xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tournament Categories */}
          <div className="bg-white rounded-xl p-6 shadow-card">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Categorias do Torneio
            </h2>
            <div className="space-y-3">
              {[
                { name: 'Categoria A', active: true },
                { name: 'Categoria B', active: false },
                { name: 'Categoria C', active: false },
                { name: 'Categoria D', active: false },
                { name: 'Categoria Kids', active: false },
                { name: 'Categoria Especial A', active: false },
              ].map((category, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    category.active
                      ? 'bg-primary-100 text-primary-800 font-medium'
                      : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {category.name}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Participants */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">
                Participantes Recentes
              </h2>
              <div className="flex items-center space-x-4">
                <button className="text-neutral-600 hover:text-neutral-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button className="bg-primary-400 text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors">
                  + Adicionar
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {recentParticipants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-neutral-900">
                      {participant.name}
                    </h3>
                    <p className="text-sm text-neutral-600">{participant.club}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Editar
                    </button>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
            <h3 className="font-semibold text-neutral-900 mb-2">
              Criar Novo Torneio
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Configure um novo torneio com categorias e participantes
            </p>
            <button className="bg-primary-400 text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors">
              Criar Torneio
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-neutral-900 mb-2">
              Importar Atletas
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Adicione múltiplos atletas via arquivo CSV
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
              Importar CSV
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-semibold text-neutral-900 mb-2">
              Exportar Dados
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Baixe relatórios e dados dos torneios
            </p>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
              Exportar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;