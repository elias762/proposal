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
    return date.toLocaleDateString('en-GB', {
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
        title="Clients"
        subtitle="Client profiles, history, and proposal activity."
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
              placeholder="Search by client name or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add-client">
            + Add Client
          </button>
        </div>

        <div className="clients-table-card">
          <div className="table-container">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Industry</th>
                  <th>Active Projects</th>
                  <th>Completed</th>
                  <th>Proposals</th>
                  <th>Last Activity</th>
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
                <p>No clients found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clients;
