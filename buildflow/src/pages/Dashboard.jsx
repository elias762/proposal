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
      title: 'Active Projects',
      value: activeProjects.length.toString(),
      iconType: 'projects',
    },
    {
      id: 2,
      title: 'Projects At Risk',
      value: atRiskProjects.length.toString(),
      iconType: 'risk',
      alert: atRiskProjects.length > 0,
    },
    {
      id: 3,
      title: 'Avg. Project Duration',
      value: '14 weeks',
      iconType: 'duration',
    },
    {
      id: 4,
      title: 'Utilization Rate',
      value: '78%',
      iconType: 'utilization',
    },
  ];

  const dashboardProjects = projects.slice(0, 6).map(p => ({
    ...p,
    budget: typeof p.budget === 'number' ? `€${p.budget.toLocaleString('de-DE')}` : p.budget,
  }));

  return (
    <div className="dashboard">
      <Header
        title="BuildFlow Dashboard"
        subtitle="Track projects, plan resources, generate proposals."
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
            <h2 className="section-title">Active Projects</h2>
            <button className="section-action" onClick={() => navigate('/projects')}>
              View All
            </button>
          </div>
          <div className="section-card">
            <ProjectsTable projects={dashboardProjects} />
          </div>
        </section>

        <div className="two-column-grid">
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Upcoming Milestones</h2>
              <button className="section-action">View Calendar</button>
            </div>
            <div className="section-card">
              <MilestonesList milestones={milestonesData} />
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Recent Activity</h2>
              <button className="section-action">View All</button>
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
