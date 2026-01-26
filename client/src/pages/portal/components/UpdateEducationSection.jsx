import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const EducationSection = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    school: '',
    location: '',
    degree: '',
    minor: '',
    year: '',
    gpa: '',
    status: 'Current',
    courses: '',
    logo: null,
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await axios.get('/api/education');
      setEducation(response.data);
    } catch (error) {
      console.error('Error fetching education:', error);
      toast.error('Failed to fetch education');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('school', formData.school);
    data.append('location', formData.location);
    data.append('degree', formData.degree);
    data.append('minor', formData.minor);
    data.append('year', formData.year);
    data.append('gpa', formData.gpa);
    data.append('status', formData.status);
    data.append('courses', formData.courses);
    if (formData.logo) {
      data.append('logo', formData.logo);
    }

    try {
      if (editingId) {
        await axios.put(`/api/education/${editingId}`, data);
        toast.success('Education updated!');
      } else {
        await axios.post('/api/education', data);
        toast.success('Education added!');
      }
      fetchEducation();
      closeModal();
    } catch (error) {
      console.error('Error saving education:', error);
      toast.error('Failed to save education');
    }
  };

  const handleDelete = async (publicId) => {
    if (!confirm('Delete this education entry?')) return;
    
    try {
      await axios.delete(`/api/education/${publicId}`);
      toast.success('Education deleted!');
      fetchEducation();
    } catch (error) {
      console.error('Error deleting education:', error);
      toast.error('Failed to delete education');
    }
  };

  const openEditModal = (edu) => {
    setEditingId(edu.publicId);
    setFormData({
      school: edu.school,
      location: edu.location,
      degree: edu.degree,
      minor: edu.minor || '',
      year: edu.year,
      gpa: edu.gpa || '',
      status: edu.status,
      courses: edu.courses?.join(', ') || '',
      logo: null,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({
      school: '',
      location: '',
      degree: '',
      minor: '',
      year: '',
      gpa: '',
      status: 'Current',
      courses: '',
      logo: null,
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Education</h2>
          <p className="text-secondary text-sm mt-1">Manage your academic background</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#915EFF] to-[#7a4ee6] text-white rounded-xl font-medium hover:brightness-110 transition-all"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Education
        </button>
      </div>

      {/* Education Cards */}
      {loading ? (
        <div className="text-secondary">Loading...</div>
      ) : education.length === 0 ? (
        <div className="bg-[#0a0a0f] border border-dashed border-white/20 rounded-2xl p-12 text-center">
          <FontAwesomeIcon icon={faGraduationCap} className="text-4xl text-secondary mb-4" />
          <p className="text-secondary">No education entries yet</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 text-[#915EFF] hover:underline"
          >
            Add your first one
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {education.map((edu) => (
            <div
              key={edu.publicId}
              className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 hover:border-[#915EFF]/30 transition-all group"
            >
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {edu.logo ? (
                    <img src={edu.logo} alt={edu.school} className="w-full h-full object-contain p-2" />
                  ) : (
                    <FontAwesomeIcon icon={faGraduationCap} className="text-xl text-secondary" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{edu.school}</h3>
                      <p className="text-secondary text-sm">{edu.location}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                      edu.status === 'Current' ? 'bg-green-500/20 text-green-400' :
                      edu.status === 'Future' ? 'bg-[#915EFF]/20 text-[#915EFF]' :
                      'bg-white/10 text-secondary'
                    }`}>
                      {edu.status}
                    </span>
                  </div>
                  
                  <p className="text-[#915EFF] font-medium mt-2">{edu.degree}</p>
                  {edu.minor && <p className="text-secondary text-sm">Minor in {edu.minor}</p>}
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-secondary">
                    <span>{edu.year}</span>
                    {edu.gpa && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>{edu.gpa} GPA</span>
                      </>
                    )}
                  </div>
                  
                  {edu.courses?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {edu.courses.map((course, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-secondary">
                          {course}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(edu)}
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/30 text-secondary hover:text-blue-400 transition-all"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.publicId)}
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-secondary hover:text-red-400 transition-all"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Edit Education' : 'Add Education'}
              </h3>
              <button onClick={closeModal} className="text-secondary hover:text-white">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-secondary mb-2">School Name</label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-secondary/50 focus:border-[#915EFF]/50 focus:outline-none"
                    placeholder="Union College"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-secondary/50 focus:border-[#915EFF]/50 focus:outline-none"
                    placeholder="Schenectady, NY"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#915EFF]/50 focus:outline-none"
                  >
                    <option value="Current">Current</option>
                    <option value="Completed">Completed</option>
                    <option value="Future">Future</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-secondary mb-2">Degree</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-secondary/50 focus:border-[#915EFF]/50 focus:outline-none"
                    placeholder="B.S. Computer Science"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Minor (optional)</label>
                  <input
                    type="text"
                    value={formData.minor}
                    onChange={(e) => setFormData({ ...formData, minor: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-secondary/50 focus:border-[#915EFF]/50 focus:outline-none"
                    placeholder="Statistics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Year Range</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-secondary/50 focus:border-[#915EFF]/50 focus:outline-none"
                    placeholder="2022 — 2026"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">GPA (optional)</label>
                  <input
                    type="text"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-secondary/50 focus:border-[#915EFF]/50 focus:outline-none"
                    placeholder="3.8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Logo (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, logo: e.target.files[0] })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#915EFF] file:text-white file:cursor-pointer"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Courses (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.courses}
                    onChange={(e) => setFormData({ ...formData, courses: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-secondary/50 focus:border-[#915EFF]/50 focus:outline-none"
                    placeholder="Data Structures, Algorithms, Machine Learning"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-secondary hover:text-white border border-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#915EFF] to-[#7a4ee6] text-white font-medium hover:brightness-110 transition-all"
                >
                  {editingId ? 'Save Changes' : 'Add Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationSection;
