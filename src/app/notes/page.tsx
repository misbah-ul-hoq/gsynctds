/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import {
  useAddEventMutation,
  useSyncPostMutation,
  useDeleteEventMutation,
  useGetEventsQuery,
  useSyncDeleteMutation,
  useGetEventsCountMutation,
} from "@/redux/features/events/eventApiSlice";
import moment from "moment";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
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
  const [auth, setAuth] = useState<undefined | null | string>();
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
  const [syncPost] = useSyncPostMutation();
  const { data: events, isLoading: isLoadingEvents } = useGetEventsQuery();
  const [eventsCount] = useGetEventsCountMutation();
  const [syncPostCompleted, setSyncPostCompleted] = useState(false);

  if (typeof auth !== undefined && auth === null) {
    redirect("/login");
  }

  useEffect(() => {
    setAuth(localStorage.getItem("authToken"));
    const syncAllPost = async () => {
      try {
        // Always call the API, even if events are empty
        // @ts-ignore
        if (events?.length) {
          await Promise.all(
            // @ts-ignore
            events.map((event) =>
              syncPost({
                _id: event._id,
                accessToken: session?.accessToken,
              }).unwrap(),
            ),
          );
        } else {
          // Call API with an empty payload if there are no events
          await syncPost({
            _id: null,
            accessToken: session?.accessToken,
          }).unwrap();
        }

        console.log("All sync requests completed!");
      } catch (error) {
        console.error("Error syncing posts:", error);
      }
    };

    if (session?.accessToken) {
      eventsCount({ accessToken: session?.accessToken })
        .unwrap()
        .then((res) => {
          console.log(res);
          if (res.shouldSync) {
            syncAllPost();
            setSyncPostCompleted(true);
          }
        });

      eventsCount({ accessToken: session?.accessToken })
        .unwrap()
        .then((res) => {
          console.log(res);
          if (res.shouldSync && syncPostCompleted) {
            syncDelete({ accessToken: session?.accessToken })
              .unwrap()
              .then(() => {});
          }
        });
    }
  }, [
    session?.accessToken,
    events,
    syncDelete,
    syncPost,
    isLoadingEvents,
    eventsCount,
    syncPostCompleted,
  ]);
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
            // @ts-ignore
            events?.map((event: EventType) => (
              <EventCard key={event._id} event={event} />
            ))}
        </div>
      </div>

      <div className="mt-7"></div>
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
  const { _id, summary, description, start, end, status, priority } = event;
  const [deleteEvent] = useDeleteEventMutation();

  const handleDeleteEvent = async (id: string) => {
    deleteEvent(id).unwrap();
  };

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
        <button
          className="btn btn-outline btn-warning btn-sm"
          onClick={() => handleDeleteEvent(_id as string)}
        >
          Delete
        </button>
        <button className="btn btn-primary btn-sm">Update</button>
      </div>
    </div>
  );
};
