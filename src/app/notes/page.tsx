"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NotesPage = () => {
  const { data } = useSession();
  const [events, setEvents] = useState(null);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

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
  return (
    <div className="my-4">
      <div className="mb-3">
        <button className="btn btn-outline btn-primary" onClick={() => {}}>
          Add Event
        </button>
      </div>

      <div className="">
        <div>
          <p className="">Start</p>
          <DatePicker
            selected={start}
            onChange={(date) => setStart(date)}
            showTimeSelect
          />
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
