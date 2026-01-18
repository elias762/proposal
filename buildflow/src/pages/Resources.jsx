import { useState } from 'react';
import Header from '../components/Header/Header';
import './Resources.css';

// Demo data for team members
const teamData = [
  {
    id: 1,
    name: 'Maria Colombo',
    role: 'Project Manager',
    department: 'Gestione Progetti',
    email: 'm.colombo@buildflow.it',
    phone: '+39 02 1234 5601',
    availability: 85,
    assignedProjects: ['Ristrutturazione Palazzo Navigli', 'Villa sul Lago di Como'],
    status: 'active',
    skills: ['Gestione cantiere', 'Pianificazione', 'Coordinamento'],
  },
  {
    id: 2,
    name: 'Luca Romano',
    role: 'Project Manager',
    department: 'Gestione Progetti',
    email: 'l.romano@buildflow.it',
    phone: '+39 02 1234 5602',
    availability: 92,
    assignedProjects: ['Fit-Out Uffici Torre Garibaldi', 'Ampliamento Stazione Termini'],
    status: 'active',
    skills: ['Commerciale', 'Infrastrutture', 'Budget'],
  },
  {
    id: 3,
    name: 'Sara Fontana',
    role: 'Project Manager',
    department: 'Gestione Progetti',
    email: 's.fontana@buildflow.it',
    phone: '+39 02 1234 5603',
    availability: 78,
    assignedProjects: ['Ristrutturazione Centro Commerciale Adriatico', 'Complesso Residenziale Porta Nuova'],
    status: 'active',
    skills: ['Ristrutturazioni', 'Residenziale', 'Retail'],
  },
  {
    id: 4,
    name: 'Andrea Martini',
    role: 'Project Manager',
    department: 'Gestione Progetti',
    email: 'a.martini@buildflow.it',
    phone: '+39 02 1234 5604',
    availability: 65,
    assignedProjects: ['Riparazione Ponte Flaminio', 'Rifacimento Strade Zona EUR'],
    status: 'active',
    skills: ['Infrastrutture', 'Opere pubbliche', 'Sicurezza'],
  },
  {
    id: 5,
    name: 'Valentina Costa',
    role: 'Project Manager',
    department: 'Gestione Progetti',
    email: 'v.costa@buildflow.it',
    phone: '+39 02 1234 5605',
    availability: 70,
    assignedProjects: ['Ampliamento Magazzino Fase 1', 'Restauro Palazzo Storico Venezia'],
    status: 'active',
    skills: ['Logistica', 'Restauro', 'Vincoli storici'],
  },
  {
    id: 6,
    name: 'Marco Benedetti',
    role: 'Ingegnere Strutturale',
    department: 'Ingegneria',
    email: 'm.benedetti@buildflow.it',
    phone: '+39 02 1234 5606',
    availability: 90,
    assignedProjects: ['Riparazione Ponte Flaminio', 'Ampliamento Stazione Termini'],
    status: 'active',
    skills: ['Calcolo strutturale', 'Cemento armato', 'Acciaio'],
  },
  {
    id: 7,
    name: 'Elena Rizzo',
    role: 'Architetto',
    department: 'Progettazione',
    email: 'e.rizzo@buildflow.it',
    phone: '+39 02 1234 5607',
    availability: 75,
    assignedProjects: ['Villa sul Lago di Como', 'Complesso Residenziale Porta Nuova'],
    status: 'active',
    skills: ['Design interni', 'Residenziale', 'Sostenibilità'],
  },
  {
    id: 8,
    name: 'Giuseppe Ferrara',
    role: 'Capo Cantiere',
    department: 'Operazioni',
    email: 'g.ferrara@buildflow.it',
    phone: '+39 02 1234 5608',
    availability: 100,
    assignedProjects: ['Ristrutturazione Palazzo Navigli'],
    status: 'active',
    skills: ['Coordinamento squadre', 'Sicurezza', 'Qualità'],
  },
  {
    id: 9,
    name: 'Francesca Galli',
    role: 'Responsabile Acquisti',
    department: 'Procurement',
    email: 'f.galli@buildflow.it',
    phone: '+39 02 1234 5609',
    availability: 88,
    assignedProjects: [],
    status: 'active',
    skills: ['Negoziazione', 'Fornitori', 'Logistica'],
  },
  {
    id: 10,
    name: 'Roberto Santini',
    role: 'Responsabile Sicurezza',
    department: 'HSE',
    email: 'r.santini@buildflow.it',
    phone: '+39 02 1234 5610',
    availability: 95,
    assignedProjects: [],
    status: 'active',
    skills: ['RSPP', 'Formazione', 'Normativa'],
  },
  {
    id: 11,
    name: 'Alessia Morandi',
    role: 'Geometra',
    department: 'Tecnico',
    email: 'a.morandi@buildflow.it',
    phone: '+39 02 1234 5611',
    availability: 82,
    assignedProjects: ['Fit-Out Uffici Torre Garibaldi', 'Rifacimento Strade Zona EUR'],
    status: 'active',
    skills: ['Rilievi', 'Contabilità lavori', 'Direzione lavori'],
  },
  {
    id: 12,
    name: 'Davide Conti',
    role: 'Ingegnere Impianti',
    department: 'Ingegneria',
    email: 'd.conti@buildflow.it',
    phone: '+39 02 1234 5612',
    availability: 60,
    assignedProjects: ['Ristrutturazione Centro Commerciale Adriatico', 'Ampliamento Magazzino Fase 1'],
    status: 'busy',
    skills: ['HVAC', 'Elettrico', 'Antincendio'],
  },
];

// Demo data for equipment
const equipmentData = [
  {
    id: 1,
    name: 'Gru a Torre Liebherr 71K',
    category: 'Sollevamento',
    status: 'in-use',
    assignedProject: 'Complesso Residenziale Porta Nuova',
    location: 'Firenze',
    nextMaintenance: '2026-02-15',
    dailyRate: 450,
  },
  {
    id: 2,
    name: 'Escavatore Caterpillar 320',
    category: 'Movimento Terra',
    status: 'in-use',
    assignedProject: 'Rifacimento Strade Zona EUR',
    location: 'Roma',
    nextMaintenance: '2026-01-28',
    dailyRate: 380,
  },
  {
    id: 3,
    name: 'Betoniera Autocaricante Fiori DB 400',
    category: 'Calcestruzzo',
    status: 'available',
    assignedProject: null,
    location: 'Deposito Milano',
    nextMaintenance: '2026-03-10',
    dailyRate: 220,
  },
  {
    id: 4,
    name: 'Piattaforma Aerea JLG 600AJ',
    category: 'Sollevamento',
    status: 'in-use',
    assignedProject: 'Restauro Palazzo Storico Venezia',
    location: 'Venezia',
    nextMaintenance: '2026-02-01',
    dailyRate: 280,
  },
  {
    id: 5,
    name: 'Rullo Compattatore Bomag BW 120',
    category: 'Compattazione',
    status: 'in-use',
    assignedProject: 'Rifacimento Strade Zona EUR',
    location: 'Roma',
    nextMaintenance: '2026-02-20',
    dailyRate: 190,
  },
  {
    id: 6,
    name: 'Ponteggio Multidirezionale 500mq',
    category: 'Ponteggi',
    status: 'in-use',
    assignedProject: 'Ristrutturazione Palazzo Navigli',
    location: 'Milano',
    nextMaintenance: '2026-04-01',
    dailyRate: 150,
  },
  {
    id: 7,
    name: 'Miniescavatore Kubota KX057',
    category: 'Movimento Terra',
    status: 'maintenance',
    assignedProject: null,
    location: 'Officina Verona',
    nextMaintenance: '2026-01-20',
    dailyRate: 180,
  },
  {
    id: 8,
    name: 'Carrello Elevatore Toyota 3t',
    category: 'Movimentazione',
    status: 'available',
    assignedProject: null,
    location: 'Deposito Milano',
    nextMaintenance: '2026-03-15',
    dailyRate: 120,
  },
  {
    id: 9,
    name: 'Generatore Diesel 100kVA',
    category: 'Energia',
    status: 'in-use',
    assignedProject: 'Villa sul Lago di Como',
    location: 'Bellagio',
    nextMaintenance: '2026-02-28',
    dailyRate: 95,
  },
  {
    id: 10,
    name: 'Pompa Calcestruzzo Putzmeister 36m',
    category: 'Calcestruzzo',
    status: 'in-use',
    assignedProject: 'Ampliamento Stazione Termini',
    location: 'Roma',
    nextMaintenance: '2026-01-25',
    dailyRate: 520,
  },
];

// Demo data for materials inventory
const materialsData = [
  {
    id: 1,
    name: 'Cemento Portland 425',
    category: 'Leganti',
    unit: 'tonnellate',
    inStock: 85,
    reserved: 45,
    minStock: 30,
    unitCost: 120,
    supplier: 'Italcementi S.p.A.',
  },
  {
    id: 2,
    name: 'Acciaio per Armature B450C',
    category: 'Ferro',
    unit: 'tonnellate',
    inStock: 42,
    reserved: 28,
    minStock: 20,
    unitCost: 850,
    supplier: 'Feralpi Group',
  },
  {
    id: 3,
    name: 'Mattoni Forati 8x25x25',
    category: 'Laterizi',
    unit: 'migliaia',
    inStock: 120,
    reserved: 35,
    minStock: 50,
    unitCost: 180,
    supplier: 'Wienerberger Italia',
  },
  {
    id: 4,
    name: 'Calcestruzzo C25/30',
    category: 'Premiscelati',
    unit: 'm³',
    inStock: 0,
    reserved: 150,
    minStock: 0,
    unitCost: 95,
    supplier: 'Calcestruzzi S.p.A.',
  },
  {
    id: 5,
    name: 'Isolante XPS 80mm',
    category: 'Isolamento',
    unit: 'm²',
    inStock: 2500,
    reserved: 800,
    minStock: 500,
    unitCost: 18,
    supplier: 'Dow Italia',
  },
  {
    id: 6,
    name: 'Cartongesso Standard 13mm',
    category: 'Finiture',
    unit: 'm²',
    inStock: 3200,
    reserved: 1400,
    minStock: 1000,
    unitCost: 8,
    supplier: 'Knauf Italia',
  },
  {
    id: 7,
    name: 'Cavi Elettrici FG7OR 3x2.5',
    category: 'Impianti',
    unit: 'metri',
    inStock: 15000,
    reserved: 6000,
    minStock: 5000,
    unitCost: 2.5,
    supplier: 'Prysmian Group',
  },
  {
    id: 8,
    name: 'Tubazioni PVC 110mm',
    category: 'Impianti',
    unit: 'metri',
    inStock: 800,
    reserved: 350,
    minStock: 200,
    unitCost: 12,
    supplier: 'Nicoll Italia',
  },
  {
    id: 9,
    name: 'Vernice Murale Bianca',
    category: 'Finiture',
    unit: 'litri',
    inStock: 1200,
    reserved: 400,
    minStock: 300,
    unitCost: 6,
    supplier: 'San Marco Group',
  },
  {
    id: 10,
    name: 'Piastrelle Gres 60x60',
    category: 'Pavimenti',
    unit: 'm²',
    inStock: 1800,
    reserved: 650,
    minStock: 500,
    unitCost: 28,
    supplier: 'Marazzi Group',
  },
];

function Resources() {
  const [activeTab, setActiveTab] = useState('team');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="status-badge status-active">Attivo</span>;
      case 'busy':
        return <span className="status-badge status-busy">Occupato</span>;
      case 'away':
        return <span className="status-badge status-away">Assente</span>;
      case 'in-use':
        return <span className="status-badge status-in-use">In Uso</span>;
      case 'available':
        return <span className="status-badge status-available">Disponibile</span>;
      case 'maintenance':
        return <span className="status-badge status-maintenance">Manutenzione</span>;
      default:
        return null;
    }
  };

  const getAvailabilityClass = (availability) => {
    if (availability >= 80) return 'availability-high';
    if (availability >= 50) return 'availability-medium';
    return 'availability-low';
  };

  const getStockStatus = (inStock, minStock) => {
    if (inStock === 0) return 'stock-empty';
    if (inStock <= minStock) return 'stock-low';
    if (inStock <= minStock * 1.5) return 'stock-medium';
    return 'stock-ok';
  };

  const formatCurrency = (amount) => {
    return `€${amount.toLocaleString('it-IT')}`;
  };

  const filteredTeam = teamData.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEquipment = equipmentData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMaterials = materialsData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary stats
  const teamStats = {
    total: teamData.length,
    available: teamData.filter((m) => m.availability >= 80).length,
    avgUtilization: Math.round(teamData.reduce((acc, m) => acc + (100 - m.availability), 0) / teamData.length),
  };

  const equipmentStats = {
    total: equipmentData.length,
    inUse: equipmentData.filter((e) => e.status === 'in-use').length,
    available: equipmentData.filter((e) => e.status === 'available').length,
    maintenance: equipmentData.filter((e) => e.status === 'maintenance').length,
  };

  const materialsStats = {
    totalValue: materialsData.reduce((acc, m) => acc + m.inStock * m.unitCost, 0),
    lowStock: materialsData.filter((m) => m.inStock <= m.minStock && m.inStock > 0).length,
    outOfStock: materialsData.filter((m) => m.inStock === 0).length,
  };

  return (
    <div className="resources-page">
      <Header
        title="Risorse"
        subtitle="Gestione personale, attrezzature e materiali"
      />

      <div className="resources-content">
        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon team-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="summary-info">
              <span className="summary-value">{teamStats.total}</span>
              <span className="summary-label">Membri Team</span>
              <span className="summary-detail">{teamStats.avgUtilization}% utilizzo medio</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon equipment-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div className="summary-info">
              <span className="summary-value">{equipmentStats.total}</span>
              <span className="summary-label">Attrezzature</span>
              <span className="summary-detail">{equipmentStats.inUse} in uso, {equipmentStats.available} disponibili</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon materials-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div className="summary-info">
              <span className="summary-value">{formatCurrency(materialsStats.totalValue)}</span>
              <span className="summary-label">Valore Magazzino</span>
              <span className="summary-detail">{materialsStats.lowStock} sotto scorta minima</span>
            </div>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="resources-toolbar">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === 'team' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              Team ({teamData.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'equipment' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('equipment')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Attrezzature ({equipmentData.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'materials' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('materials')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              Materiali ({materialsData.length})
            </button>
          </div>

          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Cerca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="resources-table-card">
            <div className="table-container">
              <table className="resources-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Ruolo</th>
                    <th>Dipartimento</th>
                    <th>Disponibilità</th>
                    <th>Progetti Assegnati</th>
                    <th>Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeam.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div className="member-cell">
                          <div className="member-avatar">
                            {member.name.split(' ').map((w) => w[0]).join('')}
                          </div>
                          <div className="member-info">
                            <span className="member-name">{member.name}</span>
                            <span className="member-email">{member.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>{member.role}</td>
                      <td>
                        <span className="department-badge">{member.department}</span>
                      </td>
                      <td>
                        <div className="availability-cell">
                          <div className="availability-bar">
                            <div
                              className={`availability-fill ${getAvailabilityClass(member.availability)}`}
                              style={{ width: `${member.availability}%` }}
                            />
                          </div>
                          <span className="availability-text">{member.availability}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="projects-cell">
                          {member.assignedProjects.length > 0 ? (
                            member.assignedProjects.map((project, i) => (
                              <span key={i} className="project-tag">{project}</span>
                            ))
                          ) : (
                            <span className="no-projects">Nessun progetto</span>
                          )}
                        </div>
                      </td>
                      <td>{getStatusBadge(member.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div className="resources-table-card">
            <div className="table-container">
              <table className="resources-table">
                <thead>
                  <tr>
                    <th>Attrezzatura</th>
                    <th>Categoria</th>
                    <th>Stato</th>
                    <th>Progetto Assegnato</th>
                    <th>Ubicazione</th>
                    <th>Prossima Manut.</th>
                    <th>Tariffa/Giorno</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipment.map((item) => (
                    <tr key={item.id}>
                      <td className="equipment-name">{item.name}</td>
                      <td>
                        <span className="category-badge">{item.category}</span>
                      </td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td>
                        {item.assignedProject ? (
                          <span className="project-tag">{item.assignedProject}</span>
                        ) : (
                          <span className="no-projects">—</span>
                        )}
                      </td>
                      <td>{item.location}</td>
                      <td>{new Date(item.nextMaintenance).toLocaleDateString('it-IT')}</td>
                      <td className="rate-cell">{formatCurrency(item.dailyRate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div className="resources-table-card">
            <div className="table-container">
              <table className="resources-table">
                <thead>
                  <tr>
                    <th>Materiale</th>
                    <th>Categoria</th>
                    <th>Giacenza</th>
                    <th>Prenotato</th>
                    <th>Disponibile</th>
                    <th>Costo Unitario</th>
                    <th>Fornitore</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((item) => {
                    const available = item.inStock - item.reserved;
                    return (
                      <tr key={item.id}>
                        <td className="material-name">{item.name}</td>
                        <td>
                          <span className="category-badge">{item.category}</span>
                        </td>
                        <td>
                          <span className={`stock-value ${getStockStatus(item.inStock, item.minStock)}`}>
                            {item.inStock.toLocaleString('it-IT')} {item.unit}
                          </span>
                        </td>
                        <td>{item.reserved.toLocaleString('it-IT')} {item.unit}</td>
                        <td>
                          <span className={available <= 0 ? 'stock-empty' : ''}>
                            {available.toLocaleString('it-IT')} {item.unit}
                          </span>
                        </td>
                        <td className="rate-cell">{formatCurrency(item.unitCost)}/{item.unit}</td>
                        <td className="supplier-cell">{item.supplier}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Resources;
