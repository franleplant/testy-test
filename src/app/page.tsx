"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

type EventPayload = {
  name: string;
  start: number;
  end: number;
};

export default function Home() {
  const selectedDate: number = new Date().getDate();
  const [events, setEvents] = useState<Array<EventPayload>>([]);
  console.log("EVENTS", events);
  return (
    <main className={styles.Layout}>
      <div>
        <h1>My Super Calendar</h1>
        <h2>{new Intl.DateTimeFormat("en-US").format(selectedDate)}</h2>
        <EventForm
          onSubmit={(event) => {
            setEvents((prev) => [...prev, event]);
          }}
        />
      </div>
      <DayGrid events={events}></DayGrid>
    </main>
  );
}

type EventForm = {
  name: string;
  start?: string;
  end?: string;
};

/**
 * @returns hour (0 -> 23)
 */
function fromTimeToSlot(time: string): number {
  const truncatedHour = time.split(":")[0];
  return Number(truncatedHour);
}

function EventForm(props: { onSubmit: (event: EventPayload) => void }) {
  const mode: "create" | "edit" = "asdasd" as any;

  const [form, setForm] = useState<EventForm>({
    name: "fake event",
    start: "17:00",
    end: "18:00",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const { name, start, end } = form;

        if (!start || !end) {
          throw new Error("bad form");
        }

        props.onSubmit({
          name,
          start: fromTimeToSlot(start),
          end: fromTimeToSlot(end),
        });
      }}
    >
      <input
        name="name"
        type="text"
        required
        placeholder="My Cool event"
        value={form.name}
        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
      />
      <input
        name="start"
        type="time"
        value={form.start}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, start: e.target.value }))
        }
      />
      <input
        name="end"
        type="time"
        value={form.end}
        onChange={(e) => setForm((prev) => ({ ...prev, end: e.target.value }))}
      />
      <button type="submit">{mode === "create" ? "Create" : "Save"}</button>
      {mode === "edit" && (
        <button
          type="button"
          onClick={() => {
            // TODO maybe use the mode in the same submit whatevber
          }}
        >
          Delete
        </button>
      )}
    </form>
  );
}

/**
 *
 * 0 -> 23
 *
 * @returns a list of integers that represent that hour in the day, with base 0
 *
 */
function getHoursInDay(): Array<number> {
  return "0"
    .repeat(24)
    .split("")
    .map((_, index) => index);
}

function DayGrid(props: { events: Array<EventPayload> }) {
  return (
    <table className={styles.DayGrid}>
      {getHoursInDay().map((hour) => {
        const eventsInSlot = props.events.filter(
          (event) => event.start === hour
        );
        const event: EventPayload | undefined = eventsInSlot[0];

        return (
          <tr key={hour}>
            <td className={styles.DayGridHour}>{`${hour}:00`}</td>
            <EventCell />
          </tr>
        );
      })}
    </table>
  );
}

function EventCell({
  event,
  hourSlot,
}: {
  event?: EventPayload;
  hourSlot: number;
}) {
  if (!event) {
    return <td></td>;
  }

  const rowSpan = event.end;

  return <td rowSpan={j}>{event ? event.name : ""}</td>;
}
