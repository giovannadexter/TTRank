# TTRank - Sistema de Gerenciamento de Torneios de Tênis de Mesa 🏓

Um sistema web moderno para gerenciar atletas e torneios de tênis de mesa, desenvolvido com Django REST Framework e React.

## ✨ Funcionalidades

- **Gerenciamento de Atletas**: CRUD completo para atletas com informações detalhadas
- **Importação/Exportação CSV**: Importação em massa de atletas e exportação de dados
- **Autenticação JWT**: Sistema de login seguro com tokens
- **Interface Responsiva**: Design moderno e responsivo com Tailwind CSS
- **Busca e Filtros**: Funcionalidades avançadas de busca e filtragem
- **Painel Administrativo**: Interface administrativa Django para gerenciamento backend

## 🛠️ Tecnologias Utilizadas

### Backend
- **Django 5.2** - Framework web Python
- **Django REST Framework** - Desenvolvimento de APIs
- **PostgreSQL/SQLite** - Banco de dados
- **Autenticação JWT** - Autenticação baseada em tokens
- **Django CORS Headers** - Requisições cross-origin

### Frontend
- **React 19** - Framework de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Axios** - Cliente HTTP
- **Vite** - Ferramenta de build

## 📁 Estrutura do Projeto

```
ttrank/
├── backend/
│   ├── athletes/          # App de atletas
│   │   ├── models.py      # Modelo de Atleta
│   │   ├── views.py       # Views da API
│   │   ├── serializers.py # Serialização de dados
│   │   └── admin.py       # Interface administrativa
│   ├── core/              # Utilitários compartilhados
│   │   ├── permissions.py # Permissões customizadas
│   │   └── mixins.py      # Mixins reutilizáveis
│   ├── ttrank/            # App principal do Django
│   │   ├── settings.py    # Configurações
│   │   └── urls.py        # Roteamento de URLs
│   ├── requirements.txt   # Dependências Python
│   └── .env.example       # Variáveis de ambiente
├── frontend/
│   └── ttrank-frontend/
│       ├── src/
│       │   ├── components/    # Componentes React
│       │   ├── services/      # Serviços da API
│       │   ├── types/         # Tipos TypeScript
│       │   ├── hooks/         # Hooks customizados
│       │   └── utils/         # Funções auxiliares
│       ├── package.json       # Dependências Node
│       └── tailwind.config.js # Configuração Tailwind
└── README.md
```

## 🚀 Instruções de Instalação

### Pré-requisitos
- Python 3.8+
- Node.js 16+
- npm ou yarn

### Configuração do Backend

1. **Clone e navegue até o projeto:**
   ```bash
   cd ttrank
   ```

2. **Instale as dependências Python:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configuração do ambiente:**
   ```bash
   cp .env.example .env
   # Edite o .env com suas configurações
   ```

4. **Configuração do banco de dados:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Crie um superusuário:**
   ```bash
   python manage.py createsuperuser
   ```

6. **Execute o servidor de desenvolvimento:**
   ```bash
   python manage.py runserver
   ```

### Configuração do Frontend

1. **Navegue até o diretório frontend:**
   ```bash
   cd frontend/ttrank-frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 📱 Como Usar

1. **Acesse a aplicação:**
   - Frontend: http://localhost:5173
   - API Backend: http://localhost:8000/api
   - Painel Admin: http://localhost:8000/admin

2. **Faça login com suas credenciais de superusuário**

3. **Gerencie Atletas:**
   - Crie atletas individuais
   - Importe dados em massa via CSV
   - Exporte dados de atletas
   - Busque e filtre atletas

## 📊 Formato de Importação CSV

Para importar atletas, use o seguinte formato CSV:

```csv
full_name,birth_date,phone_number,ranking_points,club
João Silva,1990-01-15,+5511999999999,1500,Clube Central
Maria Santos,1985-03-22,+5511888888888,1800,Esporte Total
```

### Campos Obrigatórios:
- `full_name` - Nome completo do atleta
- `birth_date` - Data no formato AAAA-MM-DD
- `phone_number` - Número de contato
- `ranking_points` - Pontos de ranking (número inteiro)

### Campos Opcionais:
- `club` - Clube/equipe do atleta

## 🔌 Endpoints da API

### Autenticação
- `POST /api/auth/login/` - Login
- `POST /api/auth/refresh/` - Renovar token

### Atletas
- `GET /api/athletes/` - Listar atletas
- `POST /api/athletes/` - Criar atleta
- `GET /api/athletes/{id}/` - Detalhes do atleta
- `PUT /api/athletes/{id}/` - Atualizar atleta
- `DELETE /api/athletes/{id}/` - Excluir atleta
- `POST /api/athletes/import_csv/` - Importar CSV
- `GET /api/athletes/export_csv/` - Exportar CSV

## 💻 Desenvolvimento

### Adicionando Novas Funcionalidades

1. **Backend (Django):**
   - Crie modelos no app apropriado
   - Adicione serializers para dados da API
   - Crie views com permissões adequadas
   - Atualize o roteamento de URLs

2. **Frontend (React):**
   - Defina tipos TypeScript
   - Crie funções de serviço da API
   - Construa componentes React
   - Adicione hooks customizados se necessário

### Padrões de Código

- **Backend**: Siga as convenções Django e PEP 8
- **Frontend**: Use TypeScript, componentes funcionais e hooks
- **CSS**: Use classes utilitárias do Tailwind

## 📄 Scripts Disponíveis

### Backend
```bash
python manage.py runserver    # Servidor de desenvolvimento
python manage.py test         # Executar testes
python manage.py makemigrations # Criar migrações
python manage.py migrate      # Aplicar migrações
```

### Frontend
```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run lint       # Verificar código
npm run preview    # Preview do build
```

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Faça suas alterações
4. Adicione testes se aplicável
5. Faça commit das mudanças (`git commit -m 'Adiciona MinhaFeature'`)
6. Faça push para a branch (`git push origin feature/MinhaFeature`)
7. Abra um Pull Request

## 📋 TODO

- [ ] Sistema completo de torneios
- [ ] Geração de chaves automática
- [ ] Controle de partidas em tempo real
- [ ] Relatórios avançados
- [ ] Notificações push
- [ ] App mobile

## 📧 Contato

Para dúvidas ou sugestões, entre em contato através do GitHub Issues.

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ para a comunidade de tênis de mesa** 🏓