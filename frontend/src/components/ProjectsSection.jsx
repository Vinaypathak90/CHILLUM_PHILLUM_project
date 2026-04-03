import React from 'react';
import SectionHeader from './SectionHeader';

const ProjectsSection = ({ projects, onProjectClick, onApplyTilt, onRemoveTilt }) => {
  return (
    <section id="projects">
      <div className="projects-header">
        <SectionHeader label="Our Work" titleMain="Featured" titleHighlight="Projects" align="left" />
        <a style={{textAlign: 'center'}} href="#contact" className="btn-gold">Start a Project</a>
      </div>
      <div className="projects-grid">
        {projects.filter(p => p.isFeatured !== false).map((project) => (
          <div 
            className="project-card" 
            key={project._id} 
            onClick={() => onProjectClick(project)} 
            onMouseMove={(e) => onApplyTilt(e, 8)} 
            onMouseLeave={onRemoveTilt}
          >
            <img src={project.imageUrl} alt={project.title} />
            <div className="project-info">
              <p className="project-type">{project.category}</p>
              <p className="project-name">{project.title}</p>
              <p className="project-desc">{project.shortDescription || project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
