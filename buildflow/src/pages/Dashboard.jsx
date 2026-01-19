import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import KPICard from '../components/KPICard/KPICard';
import ProjectsTable from '../components/ProjectsTable/ProjectsTable';
import MilestonesList from '../components/MilestonesList/MilestonesList';
import ActivityFeed from '../components/ActivityFeed/ActivityFeed';
import { useProjects } from '../context/ProjectsContext';
import { milestonesData, activityData } from '../data/dummyData';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { projects } = useProjects();

  const activeProjects = projects.filter(p => p.status !== 'Completed');
  const atRiskProjects = projects.filter(p => p.status === 'At Risk' || p.status === 'Delayed');

  const kpiData = [
    {
      id: 1,
      title: 'Progetti Attivi',
      value: activeProjects.length.toString(),
      iconType: 'projects',
    },
    {
      id: 2,
      title: 'Progetti a Rischio',
      value: atRiskProjects.length.toString(),
      iconType: 'risk',
      alert: atRiskProjects.length > 0,
    },
    {
      id: 3,
      title: 'Durata Media Progetto',
      value: '14 settimane',
      iconType: 'duration',
    },
    {
      id: 4,
      title: 'Tasso di Utilizzo',
      value: '78%',
      iconType: 'utilization',
    },
  ];

  const dashboardProjects = projects.slice(0, 6).map(p => ({
    ...p,
    budget: typeof p.budget === 'number' ? `€${p.budget.toLocaleString('it-IT')}` : p.budget,
  }));

  return (
    <div className="dashboard">
      <Header
        title="Dashboard"
        subtitle="Monitora progetti, pianifica risorse, genera preventivi."
      />

      <div className="dashboard-content">
        <div className="kpi-grid">
          {kpiData.map((kpi) => (
            <KPICard
              key={kpi.id}
              title={kpi.title}
              value={kpi.value}
              iconType={kpi.iconType}
              alert={kpi.alert}
            />
          ))}
        </div>

        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Progetti Attivi</h2>
            <button className="section-action" onClick={() => navigate('/projects')}>
              Vedi Tutti
            </button>
          </div>
          <div className="section-card">
            <ProjectsTable projects={dashboardProjects} />
          </div>
        </section>

        <div className="two-column-grid">
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Prossime Milestone</h2>
              <button className="section-action">Vedi Calendario</button>
            </div>
            <div className="section-card">
              <MilestonesList milestones={milestonesData} />
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Attività Recenti</h2>
              <button className="section-action">Vedi Tutte</button>
            </div>
            <div className="section-card">
              <ActivityFeed activities={activityData} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
