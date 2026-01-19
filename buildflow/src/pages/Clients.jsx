import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { clientsData } from '../data/dummyData';
import { useProjects } from '../context/ProjectsContext';
import './Clients.css';

function Clients() {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');

  const getClientStats = (clientName) => {
    const clientProjects = projects.filter(p => p.client === clientName);
    const activeProjects = clientProjects.filter(p => p.status !== 'Completed').length;
    const completedProjects = clientProjects.filter(p => p.status === 'Completed').length;
    return { activeProjects, completedProjects };
  };

  const filteredClients = clientsData.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleRowClick = (clientId) => {
    navigate(`/clients/${clientId}`);
  };

  return (
    <div className="clients-page">
      <Header
        title="Clienti"
        subtitle="Profili clienti, storico e attività preventivi."
      />

      <div className="clients-content">
        <div className="clients-toolbar">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Cerca per nome cliente o settore..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add-client">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuovo Cliente
          </button>
        </div>

        <div className="clients-table-card">
          <div className="table-container">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Nome Cliente</th>
                  <th>Settore</th>
                  <th>Progetti Attivi</th>
                  <th>Completati</th>
                  <th>Preventivi</th>
                  <th>Ultima Attività</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => {
                  const stats = getClientStats(client.name);
                  return (
                    <tr
                      key={client.id}
                      onClick={() => handleRowClick(client.id)}
                      className="clickable-row"
                    >
                      <td>
                        <div className="client-name-cell">
                          <div className="client-avatar">
                            {client.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </div>
                          <span className="client-name">{client.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="industry-badge">{client.industry}</span>
                      </td>
                      <td>
                        <span className={`project-count ${stats.activeProjects > 0 ? 'count-active' : ''}`}>
                          {stats.activeProjects}
                        </span>
                      </td>
                      <td>
                        <span className="project-count">{stats.completedProjects}</span>
                      </td>
                      <td>
                        <span className="project-count">{Math.floor(Math.random() * 4)}</span>
                      </td>
                      <td className="last-activity">{formatDate(client.lastActivity)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredClients.length === 0 && (
              <div className="no-results">
                <p>Nessun cliente trovato per "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clients;
