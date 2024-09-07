import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkillsForm from './SkillsForm';
import SkillsList from './SkillsList';
import SkillsChart from './SkillsChart';
import StrengthForm from './StrengthForm';
import StrengthList from './StrengthList';
import StrengthChart from './StrengthChart';
import './SkillsAdmin.css';

const SkillsAdmin = () => {
  const [skills, setSkills] = useState([]);
  const [strength, setStrength] = useState([]);
  const [editingSkill, setEditingSkill] = useState(false);
  const [editingStrength, setEditingStrength] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [currentStrength, setCurrentStrength] = useState(null);

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/skills`);
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const fetchStrength = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/strength`);
      setStrength(response.data);
    } catch (error) {
      console.error('Error fetching strength:', error);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchStrength();
  }, []);

  return (
    <div className="skills-container">
      <div className="skills-content">
        <div className="skills-column">
          <h1 className="skills-title">Skills</h1>
          <SkillsForm
            fetchSkills={fetchSkills}
            editing={editingSkill}
            setEditing={setEditingSkill}
            currentSkill={currentSkill}
            setCurrentSkill={setCurrentSkill}
          />
          <SkillsList
            skills={skills}
            fetchSkills={fetchSkills}
            setEditing={setEditingSkill}
            setCurrentSkill={setCurrentSkill}
          />
          <div className="skills-chart">
            <SkillsChart skills={skills} />
          </div>
        </div>
        <div className="skills-column">
          <h1 className="skills-title">Strength</h1>
          <StrengthForm
            fetchStrength={fetchStrength}
            editing={editingStrength}
            setEditing={setEditingStrength}
            currentStrength={currentStrength}
            setCurrentStrength={setCurrentStrength}
          />
          <StrengthList
            strength={strength}
            fetchStrength={fetchStrength}
            setEditing={setEditingStrength}
            setCurrentStrength={setCurrentStrength}
          />
          <div className="skills-chart">
            <StrengthChart strength={strength} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsAdmin;
