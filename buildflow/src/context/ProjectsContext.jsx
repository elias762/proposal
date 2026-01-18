import { createContext, useContext, useState } from 'react';
import { initialProjectsData } from '../data/dummyData';

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(initialProjectsData);
  const [toast, setToast] = useState(null);

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now(),
      status: 'On Track',
      milestones: [],
      risks: [],
      documents: [],
    };
    setProjects([newProject, ...projects]);
    showToast('Project created');
    return newProject;
  };

  const updateProject = (projectId, updates) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, ...updates } : p
    ));
  };

  const addMilestone = (projectId, milestone) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        const newMilestone = {
          ...milestone,
          id: Date.now(),
        };
        return {
          ...p,
          milestones: [...p.milestones, newMilestone],
        };
      }
      return p;
    }));
    showToast('Milestone added');
  };

  const updateMilestone = (projectId, milestoneId, updates) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          milestones: p.milestones.map(m =>
            m.id === milestoneId ? { ...m, ...updates } : m
          ),
        };
      }
      return p;
    }));
  };

  const addRisk = (projectId, risk) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        const newRisk = {
          ...risk,
          id: Date.now(),
        };
        return {
          ...p,
          risks: [...p.risks, newRisk],
        };
      }
      return p;
    }));
    showToast('Risk added');
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const getProject = (projectId) => {
    return projects.find(p => p.id === parseInt(projectId));
  };

  return (
    <ProjectsContext.Provider value={{
      projects,
      addProject,
      updateProject,
      addMilestone,
      updateMilestone,
      addRisk,
      getProject,
      toast,
      showToast,
    }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
