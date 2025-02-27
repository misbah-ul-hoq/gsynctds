"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const NotesPage = () => {
  const { data } = useSession();
  const [events, setEvents] = useState(null);

  console.log(events);
  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events/eventId",
      );
      const data = await response.json();
      setEvents(data);
    };
    fetchEvents();
  }, []);
  return <div>NotesPage</div>;
};

export default NotesPage;
