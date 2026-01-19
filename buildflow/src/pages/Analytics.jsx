import { useState } from 'react';
import Header from '../components/Header/Header';
import { useProjects } from '../context/ProjectsContext';
import './Analytics.css';

// Monthly revenue data (demo)
const monthlyRevenueData = [
  { month: 'Ago', value: 1850000 },
  { month: 'Set', value: 2100000 },
  { month: 'Ott', value: 2450000 },
  { month: 'Nov', value: 1980000 },
  { month: 'Dic', value: 2680000 },
  { month: 'Gen', value: 2350000 },
];

// Project performance data
const projectPerformanceData = [
  { name: 'Ristrutturazione Palazzo Navigli', budgetUsed: 68, timeUsed: 72, status: 'On Track' },
  { name: 'Fit-Out Uffici Torre Garibaldi', budgetUsed: 55, timeUsed: 58, status: 'On Track' },
  { name: 'Ristrutt. CC Adriatico', budgetUsed: 78, timeUsed: 85, status: 'At Risk' },
  { name: 'Riparazione Ponte Flaminio', budgetUsed: 92, timeUsed: 105, status: 'Delayed' },
  { name: 'Villa Lago di Como', budgetUsed: 42, timeUsed: 45, status: 'On Track' },
  { name: 'Ampliamento Stazione Termini', budgetUsed: 38, timeUsed: 42, status: 'At Risk' },
];

// Top clients by revenue
const topClientsData = [
  { name: 'Ferrovie dello Stato', revenue: 8500000, projects: 1 },
  { name: 'Toscana Sviluppo Immobiliare', revenue: 5200000, projects: 1 },
  { name: 'Comune di Roma', revenue: 4990000, projects: 2 },
  { name: 'Centro Commerciale Adriatico', revenue: 3200000, projects: 1 },
  { name: 'Immobiliare Rossi S.p.A.', revenue: 3550000, projects: 2 },
];

// Cost breakdown by category
const costBreakdownData = [
  { category: 'Manodopera', value: 35, color: '#3b82f6' },
  { category: 'Materiali', value: 40, color: '#10b981' },
  { category: 'Subappaltatori', value: 15, color: '#f59e0b' },
  { category: 'Attrezzature', value: 7, color: '#8b5cf6' },
  { category: 'Contingenza', value: 3, color: '#6b7280' },
];

// Project type distribution
const projectTypeData = [
  { type: 'Ristrutturazione', count: 3, value: 7400000, color: '#f59e0b' },
  { type: 'Commerciale', count: 2, value: 3900000, color: '#3b82f6' },
  { type: 'Infrastrutture', count: 3, value: 13490000, color: '#10b981' },
  { type: 'Residenziale', count: 2, value: 6050000, color: '#8b5cf6' },
];

function Analytics() {
  const { projects } = useProjects();
  const [timeRange, setTimeRange] = useState('6m');

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    }
    return `€${(amount / 1000).toFixed(0)}K`;
  };

  const formatFullCurrency = (amount) => {
    return `€${amount.toLocaleString('it-IT')}`;
  };

  // Calculate KPIs from projects
  const activeProjects = projects.filter((p) => p.status !== 'Completed').length;
  const completedProjects = projects.filter((p) => p.status === 'Completed').length;
  const atRiskProjects = projects.filter((p) => p.status === 'At Risk' || p.status === 'Delayed').length;
  const totalBudget = projects.reduce((acc, p) => acc + (typeof p.budget === 'number' ? p.budget : 0), 0);

  // Calculate max value for bar chart scaling
  const maxRevenue = Math.max(...monthlyRevenueData.map((d) => d.value));
  const maxClientRevenue = Math.max(...topClientsData.map((d) => d.revenue));

  return (
    <div className="analytics-page">
      <Header
        title="Analisi"
        subtitle="Metriche di business e performance dei progetti"
      />

      <div className="analytics-content">
        {/* Time Range Selector */}
        <div className="analytics-toolbar">
          <div className="time-range-selector">
            <button
              className={`range-btn ${timeRange === '1m' ? 'range-active' : ''}`}
              onClick={() => setTimeRange('1m')}
            >
              1 Mese
            </button>
            <button
              className={`range-btn ${timeRange === '3m' ? 'range-active' : ''}`}
              onClick={() => setTimeRange('3m')}
            >
              3 Mesi
            </button>
            <button
              className={`range-btn ${timeRange === '6m' ? 'range-active' : ''}`}
              onClick={() => setTimeRange('6m')}
            >
              6 Mesi
            </button>
            <button
              className={`range-btn ${timeRange === '1y' ? 'range-active' : ''}`}
              onClick={() => setTimeRange('1y')}
            >
              1 Anno
            </button>
          </div>
          <button className="btn-export">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Esporta Report
          </button>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-label">Fatturato Totale</span>
              <span className="kpi-trend trend-up">+12.5%</span>
            </div>
            <span className="kpi-value">{formatFullCurrency(totalBudget)}</span>
            <span className="kpi-comparison">vs {formatCurrency(totalBudget * 0.89)} anno prec.</span>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-label">Progetti Attivi</span>
              <span className="kpi-badge">{atRiskProjects} a rischio</span>
            </div>
            <span className="kpi-value">{activeProjects}</span>
            <span className="kpi-comparison">{completedProjects} completati quest'anno</span>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-label">Margine Medio</span>
              <span className="kpi-trend trend-up">+2.3%</span>
            </div>
            <span className="kpi-value">18.5%</span>
            <span className="kpi-comparison">Target: 20%</span>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-label">On-Time Delivery</span>
              <span className="kpi-trend trend-down">-5%</span>
            </div>
            <span className="kpi-value">78%</span>
            <span className="kpi-comparison">Target: 90%</span>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="charts-row">
          {/* Revenue Chart */}
          <div className="chart-card chart-large">
            <div className="chart-header">
              <h3 className="chart-title">Andamento Fatturato</h3>
              <span className="chart-subtitle">Ultimi 6 mesi</span>
            </div>
            <div className="bar-chart">
              {monthlyRevenueData.map((data, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{ height: `${(data.value / maxRevenue) * 100}%` }}
                    >
                      <span className="bar-value">{formatCurrency(data.value)}</span>
                    </div>
                  </div>
                  <span className="bar-label">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Ripartizione Costi</h3>
              <span className="chart-subtitle">Per categoria</span>
            </div>
            <div className="donut-chart-container">
              <div className="donut-chart">
                <svg viewBox="0 0 100 100">
                  {costBreakdownData.reduce((acc, item, index) => {
                    const startAngle = acc.angle;
                    const endAngle = startAngle + (item.value / 100) * 360;
                    const largeArcFlag = item.value > 50 ? 1 : 0;

                    const startRad = (startAngle - 90) * (Math.PI / 180);
                    const endRad = (endAngle - 90) * (Math.PI / 180);

                    const x1 = 50 + 40 * Math.cos(startRad);
                    const y1 = 50 + 40 * Math.sin(startRad);
                    const x2 = 50 + 40 * Math.cos(endRad);
                    const y2 = 50 + 40 * Math.sin(endRad);

                    acc.paths.push(
                      <path
                        key={index}
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={item.color}
                      />
                    );
                    acc.angle = endAngle;
                    return acc;
                  }, { paths: [], angle: 0 }).paths}
                  <circle cx="50" cy="50" r="25" fill="white" />
                </svg>
              </div>
              <div className="donut-legend">
                {costBreakdownData.map((item, index) => (
                  <div key={index} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: item.color }} />
                    <span className="legend-label">{item.category}</span>
                    <span className="legend-value">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="charts-row">
          {/* Project Performance */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Performance Progetti</h3>
              <span className="chart-subtitle">Budget vs Timeline</span>
            </div>
            <div className="performance-list">
              {projectPerformanceData.map((project, index) => (
                <div key={index} className="performance-item">
                  <div className="performance-header">
                    <span className="performance-name">{project.name}</span>
                    <span className={`performance-status status-${project.status.toLowerCase().replace(' ', '-')}`}>
                      {project.status === 'On Track' ? 'In Linea' : project.status === 'At Risk' ? 'A Rischio' : 'In Ritardo'}
                    </span>
                  </div>
                  <div className="performance-bars">
                    <div className="perf-bar-row">
                      <span className="perf-bar-label">Budget</span>
                      <div className="perf-bar-track">
                        <div
                          className={`perf-bar-fill ${project.budgetUsed > 90 ? 'perf-danger' : project.budgetUsed > 75 ? 'perf-warning' : 'perf-ok'}`}
                          style={{ width: `${Math.min(project.budgetUsed, 100)}%` }}
                        />
                      </div>
                      <span className="perf-bar-value">{project.budgetUsed}%</span>
                    </div>
                    <div className="perf-bar-row">
                      <span className="perf-bar-label">Tempo</span>
                      <div className="perf-bar-track">
                        <div
                          className={`perf-bar-fill ${project.timeUsed > 100 ? 'perf-danger' : project.timeUsed > 85 ? 'perf-warning' : 'perf-ok'}`}
                          style={{ width: `${Math.min(project.timeUsed, 100)}%` }}
                        />
                        {project.timeUsed > 100 && (
                          <div className="perf-bar-overflow" style={{ width: `${project.timeUsed - 100}%` }} />
                        )}
                      </div>
                      <span className="perf-bar-value">{project.timeUsed}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Clients */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Top Clienti</h3>
              <span className="chart-subtitle">Per fatturato</span>
            </div>
            <div className="clients-list">
              {topClientsData.map((client, index) => (
                <div key={index} className="client-item">
                  <div className="client-rank">{index + 1}</div>
                  <div className="client-info">
                    <span className="client-name">{client.name}</span>
                    <span className="client-projects">{client.projects} progett{client.projects === 1 ? 'o' : 'i'}</span>
                  </div>
                  <div className="client-revenue">
                    <div className="revenue-bar-track">
                      <div
                        className="revenue-bar-fill"
                        style={{ width: `${(client.revenue / maxClientRevenue) * 100}%` }}
                      />
                    </div>
                    <span className="revenue-value">{formatCurrency(client.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 3 */}
        <div className="charts-row">
          {/* Project Type Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Distribuzione per Tipologia</h3>
              <span className="chart-subtitle">Progetti attivi</span>
            </div>
            <div className="type-distribution">
              {projectTypeData.map((item, index) => (
                <div key={index} className="type-item">
                  <div className="type-header">
                    <span className="type-color" style={{ backgroundColor: item.color }} />
                    <span className="type-name">{item.type}</span>
                  </div>
                  <div className="type-stats">
                    <span className="type-count">{item.count} progetti</span>
                    <span className="type-value">{formatCurrency(item.value)}</span>
                  </div>
                  <div className="type-bar-track">
                    <div
                      className="type-bar-fill"
                      style={{
                        width: `${(item.value / Math.max(...projectTypeData.map((d) => d.value))) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Metriche Chiave</h3>
              <span className="chart-subtitle">Confronto con target</span>
            </div>
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-gauge">
                  <svg viewBox="0 0 100 60">
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="126"
                      strokeDashoffset={126 - (126 * 0.85)}
                    />
                  </svg>
                  <span className="gauge-value">85%</span>
                </div>
                <span className="metric-label">Utilizzo Risorse</span>
              </div>
              <div className="metric-item">
                <div className="metric-gauge">
                  <svg viewBox="0 0 100 60">
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="126"
                      strokeDashoffset={126 - (126 * 0.92)}
                    />
                  </svg>
                  <span className="gauge-value">92%</span>
                </div>
                <span className="metric-label">Soddisfazione Cliente</span>
              </div>
              <div className="metric-item">
                <div className="metric-gauge">
                  <svg viewBox="0 0 100 60">
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="126"
                      strokeDashoffset={126 - (126 * 0.72)}
                    />
                  </svg>
                  <span className="gauge-value">72%</span>
                </div>
                <span className="metric-label">Accuratezza Stime</span>
              </div>
              <div className="metric-item">
                <div className="metric-gauge">
                  <svg viewBox="0 0 100 60">
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="126"
                      strokeDashoffset={126 - (126 * 0.68)}
                    />
                  </svg>
                  <span className="gauge-value">68%</span>
                </div>
                <span className="metric-label">Tasso Conversione</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
