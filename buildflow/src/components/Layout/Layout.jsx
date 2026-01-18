import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Toast from '../Toast/Toast';
import { useProjects } from '../../context/ProjectsContext';
import './Layout.css';

function Layout() {
  const { toast } = useProjects();

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
      <Toast message={toast} />
    </div>
  );
}

export default Layout;
