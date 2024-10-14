import React, { useState, useEffect } from 'react';
import axiosInstance from '../../config';
import './Skills.css'; // Import the new CSS file for styling

function Skills() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [editingSkillIndex, setEditingSkillIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [allSkills, setAllSkills] = useState([]);

  // Fetch skills from the API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axiosInstance.get('/api/user/skills');
        setSkills(res.data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    const fetchAllSkills = async () => {
      try {
        const res = await axiosInstance.get('/api/user/skills/all');
        setAllSkills(res.data);
      } catch (error) {
        console.error('Error fetching all unique skills:', error);
      }
    };

    fetchSkills();
    fetchAllSkills();
  }, []);

  // Handle adding a new skill
  const handleAddSkill = async () => {
    if (newSkill.trim()) {
      const lowerCaseSkills = skills.map(skill => skill.toLowerCase());
      if (lowerCaseSkills.includes(newSkill.trim().toLowerCase())){
        alert("Skill already exists");
        return;
      }
      try {
        await axiosInstance.post('/api/user/skills', { skill: newSkill.trim() });
        setSkills([...skills, newSkill.trim()]);
        setNewSkill('');
        setShowDropdown(false); // Hide dropdown after adding
      } catch (error) {
        console.error('Error adding skill:', error);
      }
    }
  };

  // Handle selecting a skill from the dropdown
  const handleSkillSelection = (skill) => {
    setNewSkill(skill);
    setShowDropdown(false); // Hide dropdown after selection
  };

  // Handle editing a skill
  const handleEditSkill = async (index) => {
    try {
      await axiosInstance.put(`/api/user/skills/${index}`, { newSkill: editingText });
      const updatedSkills = [...skills];
      updatedSkills[index] = editingText;
      setSkills(updatedSkills);
      setEditingSkillIndex(null);
      setEditingText('');
    } catch (error) {
      console.error('Error editing skill:', error);
    }
  };

  // Handle deleting a skill
  const handleDeleteSkill = async (index) => {
    try {
      await axiosInstance.delete(`/api/user/skills/${index}`);
      const updatedSkills = skills.filter((_, i) => i !== index);
      setSkills(updatedSkills);
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  return (
    <div className="skills-container">
      <h1 className="skills-title">Skills</h1>

      {/* Add New Skill Section */}
      <div className="add-skill-container" style={{ position: 'relative' }}>
        <input
          type="text"
          className="input-skill"
          value={newSkill}
          onChange={(e) => {
            setNewSkill(e.target.value);
            setShowDropdown(e.target.value.length > 0); // Show dropdown if there is input
          }}
          placeholder="Add new skill"
        />
        {showDropdown && (
          <ul className="dropdown-skills position-absolute">
            {allSkills.map((skill, index) => (
              <li key={index} onClick={() => handleSkillSelection(skill)} className="dropdown-item">
                {skill}
              </li>
            ))}
          </ul>
        )}
        <button className="add-btn" onClick={handleAddSkill}>
          Add Skill
        </button>
      </div>
      <p><strong>Give proper skill name, we will use your skill data to connect you with our clients</strong>, any skills that you have we encourage you to list out here</p>

      {/* Skill List */}
      <ul className="skill-list">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <li key={index} className="skill-item">
              {editingSkillIndex === index ? (
                <div className="edit-skill-container">
                  <input
                    type="text"
                    className="input-skill"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button className="save-btn" onClick={() => handleEditSkill(index)}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={() => setEditingSkillIndex(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="skill-content">
                  <span>{skill}</span>
                  <div className="skill-actions">
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditingSkillIndex(index);
                        setEditingText(skill);
                      }}
                    >
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteSkill(index)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No skills available. Add a new skill above.</p>
        )}
      </ul>
    </div>
  );
}

export default Skills;
