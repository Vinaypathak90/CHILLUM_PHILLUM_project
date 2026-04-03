import React from 'react';
import SectionHeader from './SectionHeader';

const TeamSection = ({ team, onTeamClick }) => {
  return (
    <section id="team">
      <div className="team-header">
        <SectionHeader label="Our People" titleMain="Meet the" titleHighlight="Creative Team" align="left" />
      </div>
      <div className="team-grid">
        {team.length > 0 ? team.map((member) => (
          <div className="team-card" key={member._id} onClick={() => onTeamClick(member)} style={{cursor: 'pointer'}}>
            <div className="team-photo">
              <img src={member.photoUrl} alt={member.name} />
              <div className="team-photo-overlay"></div>
            </div>
            <p className="team-name">{member.name}</p>
            <p className="team-role">{member.role}</p>
          </div>
        )) : <p style={{color: '#888'}}>Team members will appear here.</p>}
      </div>
    </section>
  );
};

export default TeamSection;
