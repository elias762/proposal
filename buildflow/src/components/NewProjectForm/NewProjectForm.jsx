import { useState } from 'react';
import { useProjects } from '../../context/ProjectsContext';
import {
  clientsData,
  projectManagersData,
  projectTypesData,
  constraintsData,
} from '../../data/dummyData';
import './NewProjectForm.css';

const initialFormState = {
  name: '',
  client: '',
  type: '',
  location: '',
  startDate: '',
  targetEndDate: '',
  budget: '',
  projectManager: '',
  scopeSummary: '',
  constraints: [],
};

function NewProjectForm({ onClose }) {
  const { addProject } = useProjects();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleConstraintToggle = (constraint) => {
    const updatedConstraints = formData.constraints.includes(constraint)
      ? formData.constraints.filter((c) => c !== constraint)
      : [...formData.constraints, constraint];
    setFormData({ ...formData, constraints: updatedConstraints });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.budget) newErrors.budget = 'Budget is required';
    if (!formData.client) newErrors.client = 'Client is required';
    if (!formData.type) newErrors.type = 'Project type is required';
    if (!formData.projectManager) newErrors.projectManager = 'Project manager is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addProject({
      ...formData,
      budget: parseFloat(formData.budget),
    });
    setFormData(initialFormState);
    onClose();
  };

  return (
    <form className="new-project-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group form-group-full">
          <label htmlFor="name">Project Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Downtown Office Renovation"
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="client">Client *</label>
          <select
            id="client"
            name="client"
            value={formData.client}
            onChange={handleChange}
            className={errors.client ? 'input-error' : ''}
          >
            <option value="">Select client</option>
            {clientsData.map((client) => (
              <option key={client.id} value={client.name}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.client && <span className="error-message">{errors.client}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type">Project Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={errors.type ? 'input-error' : ''}
          >
            <option value="">Select type</option>
            {projectTypesData.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && <span className="error-message">{errors.type}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Munich, DE"
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectManager">Project Manager *</label>
          <select
            id="projectManager"
            name="projectManager"
            value={formData.projectManager}
            onChange={handleChange}
            className={errors.projectManager ? 'input-error' : ''}
          >
            <option value="">Select manager</option>
            {projectManagersData.map((pm) => (
              <option key={pm.id} value={pm.name}>
                {pm.name}
              </option>
            ))}
          </select>
          {errors.projectManager && (
            <span className="error-message">{errors.projectManager}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="targetEndDate">Target End Date</label>
          <input
            type="date"
            id="targetEndDate"
            name="targetEndDate"
            value={formData.targetEndDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="budget">Budget (€) *</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="e.g., 500000"
            className={errors.budget ? 'input-error' : ''}
          />
          {errors.budget && <span className="error-message">{errors.budget}</span>}
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="scopeSummary">Scope Summary</label>
          <textarea
            id="scopeSummary"
            name="scopeSummary"
            value={formData.scopeSummary}
            onChange={handleChange}
            placeholder="Brief description of project scope and objectives..."
            rows={3}
          />
        </div>

        <div className="form-group form-group-full">
          <label>Key Constraints</label>
          <div className="constraints-grid">
            {constraintsData.map((constraint) => (
              <button
                key={constraint}
                type="button"
                className={`constraint-tag ${
                  formData.constraints.includes(constraint) ? 'constraint-active' : ''
                }`}
                onClick={() => handleConstraintToggle(constraint)}
              >
                {constraint}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Create Project
        </button>
      </div>
    </form>
  );
}

export default NewProjectForm;
