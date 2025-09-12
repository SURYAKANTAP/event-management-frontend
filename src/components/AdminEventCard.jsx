export default function AdminEventCard({ event, onEdit, onDelete }) {
  const imageUrl = event.image_url || 'https://via.placeholder.com/400x200.png?text=Event+Image';

  return (
    // The main card structure is the same as EventCard for a consistent look
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <img src={imageUrl} alt={event.title} className="w-full h-48 object-cover" />
      
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h2>
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{event.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-4 border-t">
          <span>{new Date(event.date).toLocaleDateString()}</span>
          <span>{event.time}</span>
        </div>
      </div>

      {/* NEW: This is the dedicated section for admin actions */}
      <div className="bg-gray-50 p-3 border-t flex justify-between items-center space-x-3">
        <button
          onClick={onEdit}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}