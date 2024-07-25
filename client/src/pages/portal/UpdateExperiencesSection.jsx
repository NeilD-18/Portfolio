import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

const initialExperiences = [
  { id: 1, name: 'Experience 1', description: 'Description 1', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Experience 2', description: 'Description 2', image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Experience 3', description: 'Description 3', image: 'https://via.placeholder.com/150' },
];

const Experiences = ({ newExperience, setNewExperience, handleAddExperience, handleUpdateExperience, handleDeleteExperience }) => {
  const [experiences, setExperiences] = useState(initialExperiences);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = experiences.findIndex((experience) => experience.id === active.id);
      const newIndex = experiences.findIndex((experience) => experience.id === over.id);
      setExperiences((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-300 mb-2">Experiences</h2>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={experiences} strategy={verticalListSortingStrategy}>
          {experiences.map((experience) => (
            <SortableItem key={experience.id} id={experience.id}>
              <div className="p-4 bg-gray-800 text-white border border-gray-700 rounded-xl mb-2">
                <img src={experience.image} alt={experience.name} className="w-full h-32 object-cover mb-2 rounded-lg" />
                <h3 className="text-xl font-semibold">{experience.name}</h3>
                <p className="text-gray-400 mb-2">{experience.description}</p>
                <div className="flex space-x-2">
                  <button onClick={() => handleUpdateExperience(experience.id)} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors duration-300">Edit</button>
                  <button onClick={() => handleDeleteExperience(experience.id)} className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors duration-300">Delete</button>
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Add New Experience</h3>
        <input
          type="text"
          placeholder="Name"
          value={newExperience.name}
          onChange={(e) => setNewExperience({ ...newExperience, name: e.target.value })}
          className="w-full p-2 mb-2 bg-gray-800 text-white border border-gray-700 rounded-xl"
        />
        <textarea
          placeholder="Description"
          value={newExperience.description}
          onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
          className="w-full p-2 mb-2 bg-gray-800 text-white border border-gray-700 rounded-xl"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newExperience.image}
          onChange={(e) => setNewExperience({ ...newExperience, image: e.target.value })}
          className="w-full p-2 mb-2 bg-gray-800 text-white border border-gray-700 rounded-xl"
        />
        <button
          onClick={handleAddExperience}
          className="bg-violet-700 text-white px-4 py-2 rounded-xl hover:bg-violet-800 transition-colors duration-300"
        >
          Add Experience
        </button>
      </div>
    </div>
  );
};

export default Experiences;
