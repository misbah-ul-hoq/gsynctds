"use client";
import {
  useAddEventMutation,
  useAddEventToGoogleCalendarMutation,
  useDeleteEventMutation,
  useGetEventsQuery,
  useSyncDeleteMutation,
} from "@/redux/features/events/eventApiSlice";
import { access } from "fs";
import moment from "moment";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import Swal from "sweetalert2";
import truncate from "truncate";

type EventType = {
  _id?: string;
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  status: "confirmed" | "tentative" | "cancelled";
  priority: "high" | "medium" | "low";
};
const NotesPage = () => {
  const { data: session } = useSession();
  const [calendarEvents, setCalendarEvents] = useState<
    | {
        id: string;
        summary: string;
        description: string;
        start: { dateTime: string };
        end: { dateTime: string };
        status: string;
        priority: string;
      }[]
    | null
  >(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [event, setEvent] = useState<EventType>({
    summary: "",
    description: "",
    start: {
      dateTime: "",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: "",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    status: "confirmed",
    priority: "medium",
  });

  // redux hooks
  const [addEvent, { isLoading }] = useAddEventMutation();
  const [syncDelete] = useSyncDeleteMutation();
  const [deleteEvent] = useDeleteEventMutation();
  const { data: events } = useGetEventsQuery();

  useEffect(() => {
    if (session?.accessToken) {
      syncDelete({ accessToken: session?.accessToken }).unwrap();
    }
  }, [session?.accessToken]);
  const postNewEvent = async () => {
    // post event to database
    addEvent({ ...event })
      .unwrap()
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Event created successfully",
        });
        // window.location.reload();
      })
      .catch(() => {});
  };

  const handleDeleteEvent = (id: string) => {
    console.log(session?.accessToken);
    if (
      window.confirm("Are you sure you want to delete this event?") &&
      session?.accessToken
    ) {
      deleteEvent(id)
        .unwrap()
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Event deleted successfully",
          });
        });

      fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events/" + id,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + session?.accessToken,
            "Content-Type": "application/json",
          },
        },
      )
        .then((res) => {
          res.json();
        })
        .then(() => {
          // window.location.reload();
        });
    }
  };

  useEffect(() => {
    async function getCalendarEvents(accessToken: string) {
      const calendarId = "primary";
      const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Events:", data.items);
        setCalendarEvents(data.items);
        return data.items;
      } catch (error) {
        console.error("Error fetching calendar events:", error);
        return [];
      }
    }

    if (session?.accessToken) {
      getCalendarEvents(session?.accessToken);
    }
  }, [session?.accessToken]);

  return (
    <div className="my-4">
      <div className="mb-5">
        <button
          className="btn btn-outline btn-primary"
          onClick={() => {
            setShowEventForm(!showEventForm);
          }}
        >
          {showEventForm ? "Close" : "Add New Event"}
          {!showEventForm ? <FaArrowDown /> : <FaArrowUp />}
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (
            event.start.dateTime === "" ||
            event.end.dateTime === "" ||
            event.summary === "" ||
            event.description === ""
          ) {
            alert("Please fill all the fields");
            return;
          }
          postNewEvent();
        }}
        className={`overflow-hidden transition-[max-height] duration-500 ${showEventForm ? "max-h-[500px]" : "max-h-0"}`}
      >
        <div className="mb-3 flex items-center gap-5">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm">Title:</p>
              <input
                required
                type="text"
                className="input input-bordered"
                placeholder="Enter Title"
                onChange={(e) => {
                  setEvent({ ...event, summary: e.target.value });
                }}
              />
            </div>
            <div>
              <p className="text-sm">Description:</p>
              <input
                required
                type="text"
                className="input input-bordered"
                placeholder="Enter Description"
                onChange={(e) => {
                  setEvent({ ...event, description: e.target.value });
                }}
              />
            </div>
          </div>

          <div className="">
            <div className="mb-6">
              <p className="flex items-center font-semibold">
                Start <RiArrowDropDownLine size={30} />
              </p>
              <DatePicker
                selected={start}
                onChange={(date) => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  setStart(date);
                  setEvent({
                    ...event,
                    start: { ...event.start, dateTime: start.toISOString() },
                  });
                }}
                showTimeSelect
              />
            </div>

            <div className="">
              <p className="flex items-center font-semibold">
                End <RiArrowDropDownLine size={30} />{" "}
              </p>
              <DatePicker
                selected={end}
                onChange={(date) => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  setEnd(date);
                  setEvent({
                    ...event,
                    end: { ...event.end, dateTime: end.toISOString() },
                  });
                }}
                showTimeSelect
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div>
              <label htmlFor="options" className="font-semibold">
                Priority:{" "}
              </label>
              <select
                id="options"
                onChange={(e) => {
                  setEvent({
                    ...event,
                    priority: e.target.value as "high" | "medium" | "low",
                  });
                }}
                className="select select-bordered select-sm w-full max-w-xs"
              >
                <option value="">--Select an option--</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <button className="btn btn-primary" disabled={isLoading}>
          Create Event
        </button>
      </form>

      <div className="mt-5">
        {Array.isArray(events) && events.length === 0 && (
          <h2 className="mb-3 text-2xl font-bold">No events. Start creating</h2>
        )}

        {Array.isArray(events) && events.length > 0 && (
          <h2 className="mb-3 text-2xl font-bold">
            Events through GsyncTDS app.
          </h2>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(events) &&
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            events?.map((event: EventType) => (
              <EventCard key={event._id} event={event} />
            ))}
        </div>
      </div>

      <div className="mt-7">
        {Array.isArray(calendarEvents) && calendarEvents?.length === 0 && (
          <h2 className="mb-3 text-2xl font-bold">No events. Start creating</h2>
        )}

        {Array.isArray(calendarEvents) && calendarEvents?.length > 0 && (
          <h2 className="mb-3 text-2xl font-bold">
            Events through Google Calendar
          </h2>
        )}

        {/* showing calendar events */}
        {/* <div className="grid gap-3 lg:grid-cols-3">
          {Array.isArray(calendarEvents) &&
            calendarEvents?.map((event) => (
              <EventCard
                key={event.id}
                event={{
                  accessToken: session?.accessToken,
                  id: event.id,
                  _id: event.id,
                  summary: event.summary,
                  description: event.description,
                  start: event.start,
                  end: event.end,
                  status: event.status,
                }}
              />
            ))}
        </div> */}
      </div>
    </div>
  );
};

export default NotesPage;

interface EvetCardProps {
  accessToken?: string;
  id?: string;
  _id?: string;
  summary: string;
  description: string;
  start: { dateTime: string };
  end: { dateTime: string };
  status: string;
  priority?: string;
}

const EventCard = ({ event }: { event: EvetCardProps }) => {
  const { data: session } = useSession();
  const { summary, description, start, end, status, priority } = event;
  const [addEventToGoogleCalendar] = useAddEventToGoogleCalendarMutation();

  useEffect(() => {
    const postNewEventToGoogleCalendar = async (event: EvetCardProps) => {
      if (session?.user && session?.accessToken) {
        addEventToGoogleCalendar({
          ...event,
          accessToken: session?.accessToken,
        }).unwrap();
      }
    };
    if (session?.user && session?.accessToken) {
      postNewEventToGoogleCalendar({
        ...event,
        accessToken: session?.accessToken,
      });
    }
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-center gap-1">
        <h3 className="grow font-semibold text-gray-900 dark:text-white">
          {truncate(summary, 15)}
        </h3>
        <span className="badge badge-primary">{status}</span>
      </div>
      <p className="mb-4 text-sm">{truncate(description, 20)}</p>
      <div className="mb-3 text-sm">
        <p>
          <strong>Start:</strong>{" "}
          {moment(start.dateTime).format("Do MMMM, YYYY, hA")}
        </p>
        <p>
          <strong>End:</strong>{" "}
          {moment(end.dateTime).format("Do MMMM, YYYY, hA")}
        </p>
      </div>

      <div className="flex items-center justify-between">
        {priority && (
          <p className={`font-semibold`}>
            Priority: <span className="badge badge-primary">{priority}</span>
          </p>
        )}
      </div>

      <div className="mt-5 flex justify-between space-x-2">
        <button className="btn btn-outline btn-warning btn-sm">Delete</button>
        <button className="btn btn-primary btn-sm">Update</button>
      </div>
    </div>
  );
};
