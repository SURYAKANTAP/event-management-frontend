import React, { useState, useEffect } from 'react';

export default function EventFormModal({ event, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
  });
  // 1. Add new state to hold the selected image file
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().split('T')[0],
        time: event.time,
        // We no longer manage image_url directly in this form's state
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Add a handler for the file input
  const handleFileChange = (e) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 3. Pass both the text data AND the image file to the onSave handler
    onSave(formData, imageFile);
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-black">{event ? 'Edit Event' : 'Add New Event'}</h2>
        {/* Note: The form no longer has its own onSubmit */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 border rounded text-black"/>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 border rounded text-black"/>
          <input name="date" type="date" value={formData.date} onChange={handleChange} required className="w-full p-2 border rounded text-black"/>
          <input name="time" type="time" value={formData.time} onChange={handleChange} required className="w-full p-2 border rounded text-black"/>
          
          {/* 4. Change the text input to a file input */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-black">Event Image</label>
            <input 
              id="image" 
              name="image" 
              type="file" 
              onChange={handleFileChange} 
              className="w-full p-2 border rounded text-black"
            />
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-black">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}