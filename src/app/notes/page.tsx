"use client";
import { useAddEventMutation } from "@/redux/features/events/eventApiSlice";
import { stat } from "fs";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import Swal from "sweetalert2";

type EventType = {
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
  // const [events, setEvents] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
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
    priority,
  });

  // redux hooks
  const [addEvent, { isLoading }] = useAddEventMutation();

  const postNewEvent = async () => {
    // if the user connected his google account, then post the event to google calendar api
    if (session?.user) {
      fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + session?.accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log(res);
          if (res.id) {
            Swal.fire({
              icon: "success",
              title: "Event created in google calendar",
            });
          }
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Something went wrong",
          });
        });
    }

    // post the event to the backend
    addEvent(event)
      .unwrap()
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Event created successfully",
        });
      })
      .catch((error) => {});
  };

  console.log(event);
  useEffect(() => {}, []);
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
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
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

        <button className="btn btn-primary">Create Event</button>
      </form>

      <div className="mt-5">
        <h2 className="text-2xl font-bold">Events</h2>
      </div>
    </div>
  );
};

export default NotesPage;
