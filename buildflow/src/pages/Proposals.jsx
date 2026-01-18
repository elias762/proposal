import { useState } from 'react';
import Header from '../components/Header/Header';
import { clientsData, projectTypesData } from '../data/dummyData';
import {
  findSimilarProjects,
  generateProposal,
  formatCurrency,
} from '../utils/proposalGenerator';
import './Proposals.css';

const scaleOptions = ['Small', 'Medium', 'Large'];
const budgetRangeOptions = ['< €100k', '€100k–€300k', '€300k–€800k', '€800k+'];
const constraintOptions = [
  'Tempistiche strette',
  'Dipendente da permessi',
  'Lavori notturni',
  'Restrizioni rumore',
  'Accesso al sito limitato',
  'Limite budget',
  'Lavori weekend',
  'Sensibile al meteo',
  'Vincoli storici',
  'Conformità ambientale',
];

const initialFormState = {
  client: '',
  projectType: '',
  location: '',
  scale: '',
  targetStartDate: '',
  targetDeadline: '',
  requirements: '',
  constraints: [],
  budgetRange: '',
};

function Proposals() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [similarProjects, setSimilarProjects] = useState([]);
  const [linkedReferences, setLinkedReferences] = useState([]);
  const [proposal, setProposal] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Requirements are required';
    }
    if (!formData.client) {
      newErrors.client = 'Client is required';
    }
    if (!formData.projectType) {
      newErrors.projectType = 'Project type is required';
    }
    if (!formData.scale) {
      newErrors.scale = 'Scale is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;

    setIsGenerating(true);

    // Simulate AI processing delay
    setTimeout(() => {
      // Find similar projects
      const similar = findSimilarProjects(
        formData.projectType,
        formData.scale,
        formData.constraints
      );
      setSimilarProjects(similar);

      // Generate proposal
      const generatedProposal = generateProposal(formData, linkedReferences);
      setProposal(generatedProposal);

      setIsGenerating(false);
    }, 1500);
  };

  const handleLinkReference = (project) => {
    const isLinked = linkedReferences.some((r) => r.id === project.id);
    if (isLinked) {
      setLinkedReferences(linkedReferences.filter((r) => r.id !== project.id));
    } else {
      setLinkedReferences([...linkedReferences, project]);
    }

    // Update proposal if already generated
    if (proposal) {
      const newRefs = isLinked
        ? linkedReferences.filter((r) => r.id !== project.id)
        : [...linkedReferences, project];
      setProposal({ ...proposal, references: newRefs });
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setSimilarProjects([]);
    setLinkedReferences([]);
    setProposal(null);
    setErrors({});
  };

  return (
    <div className="proposals-page">
      <Header
        title="Proposals (AI)"
        subtitle="Create tailored proposals from past project experience."
      />

      <div className="proposals-content">
        <div className="proposals-grid">
          {/* Left Column */}
          <div className="left-column">
            <div className="request-card">
              <h2 className="card-title">New Request</h2>

              <form className="request-form">
                <div className="form-row">
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
                    {errors.client && (
                      <span className="error-text">{errors.client}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="projectType">Project Type *</label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className={errors.projectType ? 'input-error' : ''}
                    >
                      <option value="">Select type</option>
                      {projectTypesData.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.projectType && (
                      <span className="error-text">{errors.projectType}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="es. Milano, Roma, Firenze"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="scale">Size / Scale *</label>
                    <select
                      id="scale"
                      name="scale"
                      value={formData.scale}
                      onChange={handleChange}
                      className={errors.scale ? 'input-error' : ''}
                    >
                      <option value="">Select scale</option>
                      {scaleOptions.map((scale) => (
                        <option key={scale} value={scale}>
                          {scale}
                        </option>
                      ))}
                    </select>
                    {errors.scale && (
                      <span className="error-text">{errors.scale}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="targetStartDate">Target Start Date</label>
                    <input
                      type="date"
                      id="targetStartDate"
                      name="targetStartDate"
                      value={formData.targetStartDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="targetDeadline">Target Deadline</label>
                    <input
                      type="date"
                      id="targetDeadline"
                      name="targetDeadline"
                      value={formData.targetDeadline}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="budgetRange">Budget Range</label>
                  <select
                    id="budgetRange"
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleChange}
                  >
                    <option value="">Select range</option>
                    {budgetRangeOptions.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="requirements">Requirements *</label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="Ambito lavori, materiali, vincoli, tempistiche previste..."
                    rows={4}
                    className={errors.requirements ? 'input-error' : ''}
                  />
                  {errors.requirements && (
                    <span className="error-text">{errors.requirements}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Constraints</label>
                  <div className="constraints-grid">
                    {constraintOptions.map((constraint) => (
                      <button
                        key={constraint}
                        type="button"
                        className={`constraint-tag ${
                          formData.constraints.includes(constraint)
                            ? 'constraint-active'
                            : ''
                        }`}
                        onClick={() => handleConstraintToggle(constraint)}
                      >
                        {constraint}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="btn-primary btn-generate"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <span className="spinner"></span>
                        Generating...
                      </>
                    ) : (
                      'Generate Proposal'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Similar Past Projects */}
            {similarProjects.length > 0 && (
              <div className="similar-projects-card">
                <h2 className="card-title">Similar Past Projects</h2>
                <p className="card-subtitle">
                  Select projects to include as references in your proposal.
                </p>

                <div className="similar-projects-list">
                  {similarProjects.map((project) => {
                    const isLinked = linkedReferences.some(
                      (r) => r.id === project.id
                    );
                    return (
                      <div
                        key={project.id}
                        className={`similar-project-item ${
                          isLinked ? 'project-linked' : ''
                        }`}
                      >
                        <div className="project-info">
                          <div className="project-header">
                            <span className="project-name">{project.name}</span>
                            <span className="project-type-badge">
                              {project.type}
                            </span>
                          </div>
                          <div className="project-stats">
                            <span>{project.duration} weeks</span>
                            <span className="stat-divider">•</span>
                            <span>{formatCurrency(project.cost)}</span>
                          </div>
                          <p className="project-reason">{project.reason}</p>
                        </div>
                        <button
                          className={`btn-link-ref ${
                            isLinked ? 'btn-linked' : ''
                          }`}
                          onClick={() => handleLinkReference(project)}
                        >
                          {isLinked ? '✓ Linked' : 'Link as reference'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Proposal Draft */}
          <div className="right-column">
            {!proposal && !isGenerating && (
              <div className="proposal-placeholder">
                <div className="placeholder-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <h3>Proposal Draft</h3>
                <p>
                  Fill out the request form and click "Generate Proposal" to
                  create an AI-assisted proposal draft.
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="proposal-loading">
                <div className="loading-spinner"></div>
                <h3>Generating Proposal...</h3>
                <p>Analyzing requirements and past projects...</p>
              </div>
            )}

            {proposal && !isGenerating && (
              <div className="proposal-draft">
                <div className="proposal-header">
                  <h2 className="proposal-title">Proposal Draft</h2>
                  <span className="proposal-badge">AI Generated</span>
                </div>

                {/* Executive Summary */}
                <section className="proposal-section">
                  <h3 className="section-title">Executive Summary</h3>
                  <p className="summary-text">{proposal.executiveSummary}</p>
                </section>

                {/* Proposed Scope */}
                <section className="proposal-section">
                  <h3 className="section-title">Proposed Scope</h3>
                  <ul className="scope-list">
                    {proposal.scope.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </section>

                {/* Delivery Plan */}
                <section className="proposal-section">
                  <h3 className="section-title">Delivery Plan</h3>
                  <div className="phases-list">
                    {proposal.phases.map((phase, index) => (
                      <div key={index} className="phase-item">
                        <div className="phase-header">
                          <span className="phase-name">{phase.name}</span>
                          <span className="phase-duration">
                            {phase.duration} weeks
                          </span>
                        </div>
                        <ul className="phase-activities">
                          {phase.activities.map((activity, i) => (
                            <li key={i}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Timeline Estimate */}
                <section className="proposal-section">
                  <h3 className="section-title">Timeline Estimate</h3>
                  <div className="timeline-summary">
                    <div className="total-duration">
                      <span className="duration-label">Total Duration</span>
                      <span className="duration-value">
                        {proposal.timeline.totalDuration} weeks
                      </span>
                    </div>
                  </div>

                  <div className="timeline-details">
                    <div className="timeline-column">
                      <h4>Key Assumptions</h4>
                      <ul>
                        {proposal.timeline.assumptions.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="timeline-column">
                      <h4>Risk Factors</h4>
                      <ul>
                        {proposal.timeline.risks.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Cost Estimate */}
                <section className="proposal-section">
                  <h3 className="section-title">Cost Estimate</h3>
                  <div className="cost-summary">
                    <div className="total-cost">
                      <span className="cost-label">Total Estimate</span>
                      <span className="cost-value">
                        {formatCurrency(proposal.costEstimate.total)}
                      </span>
                    </div>
                  </div>

                  <div className="cost-breakdown">
                    <div className="cost-item">
                      <span className="cost-category">Labor</span>
                      <span className="cost-amount">
                        {formatCurrency(proposal.costEstimate.breakdown.labor)}
                      </span>
                    </div>
                    <div className="cost-item">
                      <span className="cost-category">Materials</span>
                      <span className="cost-amount">
                        {formatCurrency(proposal.costEstimate.breakdown.materials)}
                      </span>
                    </div>
                    <div className="cost-item">
                      <span className="cost-category">Subcontractors</span>
                      <span className="cost-amount">
                        {formatCurrency(proposal.costEstimate.breakdown.subcontractors)}
                      </span>
                    </div>
                    <div className="cost-item">
                      <span className="cost-category">Contingency</span>
                      <span className="cost-amount">
                        {formatCurrency(proposal.costEstimate.breakdown.contingency)}
                      </span>
                    </div>
                  </div>

                  <p className="cost-note">{proposal.costEstimate.note}</p>
                </section>

                {/* Recommended Next Actions */}
                <section className="proposal-section">
                  <h3 className="section-title">Recommended Next Actions</h3>
                  <ol className="next-actions-list">
                    {proposal.nextActions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ol>
                </section>

                {/* References Included */}
                {proposal.references.length > 0 && (
                  <section className="proposal-section">
                    <h3 className="section-title">References Included</h3>
                    <div className="references-list">
                      {proposal.references.map((ref) => (
                        <div key={ref.id} className="reference-item">
                          <span className="ref-name">{ref.name}</span>
                          <div className="ref-details">
                            <span>{ref.type}</span>
                            <span className="ref-divider">•</span>
                            <span>{ref.duration} weeks</span>
                            <span className="ref-divider">•</span>
                            <span>{formatCurrency(ref.cost)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <div className="proposal-footer">
                  <button className="btn-secondary">Export as PDF</button>
                  <button className="btn-primary">Save Proposal</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Proposals;
