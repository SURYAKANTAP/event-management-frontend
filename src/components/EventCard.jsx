export default function EventCard({ event }) {
  // A placeholder image if the event's image_url is missing
  const imageUrl = event.image_url || 'https://via.placeholder.com/400x200.png?text=Event+Image';

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
      <img src={imageUrl} alt={event.title} className="w-full h-48 object-cover" />
      
      {/* FIX: This content area is also a flex container that grows to fill available space. */}
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        {/* FIX: Responsive font size for the title. */}
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">{event.title}</h2>
        
        {/* The description will now naturally push the footer down. */}
        <p className="text-gray-600 mb-4">{event.description}</p>
        
        {/* FIX: `mt-auto` is the key. It pushes this footer to the bottom of the flex container. */}
        <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-4 border-t">
          <span>{new Date(event.date).toLocaleDateString()}</span>
          <span>{event.time}</span>
        </div>
      </div>
    </div>
  );
}