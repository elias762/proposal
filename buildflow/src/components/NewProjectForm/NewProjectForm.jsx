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
    if (!formData.name.trim()) newErrors.name = 'Il nome del progetto è obbligatorio';
    if (!formData.budget) newErrors.budget = 'Il budget è obbligatorio';
    if (!formData.client) newErrors.client = 'Il cliente è obbligatorio';
    if (!formData.type) newErrors.type = 'La tipologia è obbligatoria';
    if (!formData.projectManager) newErrors.projectManager = 'Il project manager è obbligatorio';
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
          <label htmlFor="name">Nome Progetto *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="es. Ristrutturazione Uffici Centro"
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="client">Cliente *</label>
          <select
            id="client"
            name="client"
            value={formData.client}
            onChange={handleChange}
            className={errors.client ? 'input-error' : ''}
          >
            <option value="">Seleziona cliente</option>
            {clientsData.map((client) => (
              <option key={client.id} value={client.name}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.client && <span className="error-message">{errors.client}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type">Tipologia Progetto *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={errors.type ? 'input-error' : ''}
          >
            <option value="">Seleziona tipologia</option>
            {projectTypesData.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && <span className="error-message">{errors.type}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="location">Località</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="es. Milano, Italia"
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
            <option value="">Seleziona manager</option>
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
          <label htmlFor="startDate">Data Inizio</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="targetEndDate">Data Fine Prevista</label>
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
            placeholder="es. 500000"
            className={errors.budget ? 'input-error' : ''}
          />
          {errors.budget && <span className="error-message">{errors.budget}</span>}
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="scopeSummary">Descrizione Progetto</label>
          <textarea
            id="scopeSummary"
            name="scopeSummary"
            value={formData.scopeSummary}
            onChange={handleChange}
            placeholder="Breve descrizione dell'ambito e degli obiettivi del progetto..."
            rows={3}
          />
        </div>

        <div className="form-group form-group-full">
          <label>Vincoli Principali</label>
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
          Annulla
        </button>
        <button type="submit" className="btn-primary">
          Crea Progetto
        </button>
      </div>
    </form>
  );
}

export default NewProjectForm;
