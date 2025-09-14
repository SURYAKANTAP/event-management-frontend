"use client";

import React, { useState, useEffect } from "react";
import api from "@/services/api";
import EventFormModal from "./EventFormModal"; // Import the modal
import AdminEventCard from './AdminEventCard';


function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      try {

        const payload = { role: newRole }
        await api.put(`/api/users/${userId}/role`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
        alert('User role updated successfully!');
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Failed to update role:', error);
        alert('Failed to update role.');
      }
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-black">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b text-left text-black">Name</th>
              <th className="py-2 px-4 border-b text-left text-black">Email</th>
              <th className="py-2 px-4 border-b text-center text-black">Role</th>
              <th className="py-2 px-4 border-b text-center text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b text-black">{user.name}</td>
                <td className="py-2 px-4 border-b text-black">{user.email}</td>
                <td className="py-2 px-4 border-b text-center">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {user.role === 'normal' ? (
                    <button onClick={() => handleRoleChange(user.id, 'admin')} className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600">
                      Promote to Admin
                    </button>
                  ) : (
                    <button onClick={() => handleRoleChange(user.id, 'normal')} className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600">
                      Demote to Normal
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchEvents = async () => {
    // ... (fetchEvents function is the same as before)
    setLoading(true);
    try {
      const response = await api.get("/events/");
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      alert("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenModal = (event = null) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingEvent(null);
    setIsModalOpen(false);
  };

  const handleSaveEvent = async (eventData, imageFile) => {
    // 1. Create a FormData object
    const formData = new FormData();

    // 2. Append all the text fields
    formData.append("title", eventData.title);
    formData.append("description", eventData.description);
    formData.append("date", eventData.date);
    formData.append("time", eventData.time);

    // 3. Append the image file if one was selected
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const config = {
        headers: {
          // Axios will automatically set the correct 'multipart/form-data' header
          // when you pass a FormData object, but explicitly setting it is fine too.
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingEvent) {
        // 4. Send FormData in the PUT request
        await api.put(`/events/${editingEvent.id}`, formData, config);
        alert("Event updated successfully!");
      } else {
        // 5. Send FormData in the POST request
        await api.post("/events/", formData, config);
        alert("Event created successfully!");
      }
      handleCloseModal();
      fetchEvents(); // Refresh the list
    } catch (error) {
      console.error("Failed to save event:", error);
      alert("Failed to save event.");
    }
  };

  const handleDelete = async (eventId) => {
    // ... (handleDelete function is the same as before)
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${eventId}`);
        alert("Event deleted successfully!");
        fetchEvents(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete event:", error);
        alert("Failed to delete event.");
      }
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {isModalOpen && (
        <EventFormModal
          event={editingEvent}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
        />
      )}

      {/* Header section remains similar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
        >
          Add New Event
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading events...</p>
      ) : events.length > 0 ? (
        // NEW: Replacing the table with a responsive grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {events.map((event) => (
            <AdminEventCard
              key={event.id}
              event={event}
              onEdit={() => handleOpenModal(event)} // Pass the edit handler
              onDelete={() => handleDelete(event.id)}   // Pass the delete handler
            />
          ))}
        </div>
      ) : (
        <p className="text-center mt-8 text-gray-500">No events found. Click "Add New Event" to get started.</p>
      )}

      <UserManagement />
    </div>
  );
}
