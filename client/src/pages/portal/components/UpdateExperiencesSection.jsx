import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '../utils/SortableItem';
import axios from 'axios';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const initialExperiences = [
  { id: 1, name: 'Experience 1', description: 'Description 1', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Experience 2', description: 'Description 2', image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Experience 3', description: 'Description 3', image: 'https://via.placeholder.com/150' },
];

const Experiences = ({ newExperience, setNewExperience, handleAddExperience, handleUpdateExperience, handleDeleteExperience }) => {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = experiences.findIndex((experience) => experience.id === active.id);
      const newIndex = experiences.findIndex((experience) => experience.id === over.id);
      setExperiences((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('order', newExperience.order);
    form.append('role', newExperience.role);
    form.append('responsibilities', newExperience.responsibilities);
    form.append('startDate', newExperience.startDate);
    form.append('endDate', newExperience.endDate);
    form.append('companyPicture', newExperience.companyPicture);

    try {
      const response = await axios.post('/experiences', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setExperiences([...experiences, response.data]);
      setNewExperience({
        order: '',
        role: '',
        responsibilities: '',
        startDate: '',
        endDate: '',
        companyPicture: null
      });
      setModalIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    setNewExperience({
      ...newExperience,
      companyPicture: e.target.files[0]
    });
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-6">Experiences</h2>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={experiences} strategy={verticalListSortingStrategy}>
          {experiences.map((experience) => (
            <SortableItem key={experience.id} id={experience.id}>
              <div className="p-6 bg-gray-800 text-white border border-gray-700 rounded-xl mb-4 shadow-lg">
                <div className="flex items-center space-x-4">
                  <img src={experience.image} alt={experience.name} className="w-16 h-16 object-cover rounded-full" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{experience.name}</h3>
                    <p className="text-gray-400">{experience.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleUpdateExperience(experience.id)} className="text-blue-500 hover:text-blue-700 transition duration-300">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDeleteExperience(experience.id)} className="text-red-500 hover:text-red-700 transition duration-300">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      {/* Plus sign button */}
      <button 
        onClick={() => setModalIsOpen(true)} 
        className="fixed bottom-10 right-10 w-16 h-16 bg-violet-700 text-white rounded-full text-3xl font-bold flex items-center justify-center hover:bg-violet-800 transition duration-300"
      >
        +
      </button>

      {/* Modal for adding new experience */}
      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)} 
        className="bg-gray-800 p-6 rounded-lg max-w-lg mx-auto my-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h3 className="text-2xl font-bold text-white mb-4">Add New Experience</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Order</label>
            <input
              type="number"
              name="order"
              placeholder="Order"
              value={newExperience.order}
              onChange={(e) => setNewExperience({ ...newExperience, order: e.target.value })}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Role</label>
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={newExperience.role}
              onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Responsibilities</label>
            <textarea
              name="responsibilities"
              placeholder="Responsibilities"
              value={newExperience.responsibilities}
              onChange={(e) => setNewExperience({ ...newExperience, responsibilities: e.target.value })}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Start Date</label>
            <input
              type="date"
              name="startDate"
              placeholder="Start Date"
              value={newExperience.startDate}
              onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">End Date</label>
            <input
              type="date"
              name="endDate"
              placeholder="End Date"
              value={newExperience.endDate}
              onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Company Picture</label>
            <input
              type="file"
              name="companyPicture"
              onChange={handleFileChange}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-violet-700 text-white px-4 py-2 rounded-lg hover:bg-violet-800 transition duration-300"
          >
            Add Experience
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Experiences;
