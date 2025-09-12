"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import EventCard from "@/components/EventCard";
import Link from "next/link";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  // --- Start of Protection Logic ---
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the authentication status is determined
    if (loading) {
      return;
    }
    // If not authenticated, redirect to the login page
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);
  // --- End of Protection Logic ---

  // This effect will only run if the user is authenticated
  useEffect(() => {
    // Make sure we don't fetch events if the user is not authenticated
    if (isAuthenticated) {
      const fetchEvents = async () => {
        try {
          const response = await api.get("/events/");
          setEvents(response.data);
        } catch (err) {
          setError("Failed to load events.");
          console.error(err);
        }
      };
      fetchEvents();
    }
  }, [isAuthenticated]); // Re-run if authentication status changes

  // While checking auth or before redirecting, show a loading message
  if (loading || !isAuthenticated) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  // If authenticated, render the event list
  return (
    <section className="md:py-1">
      {/* FIX: Header stacks vertically on mobile (default) and becomes a row on small screens (sm) and up. */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        {/* FIX: Responsive font size for the main heading. */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Upcoming Events
        </h1>
        {/* {user && user.role === "admin" && (
          // FIX: Button is full-width on mobile for easy tapping, auto-width on larger screens.
          <Link
            href="/admin"
            className="w-full sm:w-auto text-center px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Admin Dashboard
          </Link>
        )} */}
      </div>

      {error && <p className="text-center mt-8 text-red-600">{error}</p>}

      {events.length > 0 ? (
        // FIX: The grid layout for the cards is already responsive. This is correct.
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        !error && (
          <p className="text-center mt-8 text-gray-500">No events found.</p>
        )
      )}
    </section>
  );
}
