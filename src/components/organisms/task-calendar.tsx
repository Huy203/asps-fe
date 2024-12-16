import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Button } from "../ui";
import interactionPlugin from "@fullcalendar/interaction";

export default function TaskCalendar() {
  return (
    <FullCalendar
      editable
      droppable
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      events={[
        {
          id: "1",
          title: "All-day event",
          color: "oklch(0.97 0.014 254.604)",
          start: "2024-12-15T10:00:00",
          end: "2024-12-16T10:00:00",
          custom: "questo è un campo custom",
        },
        {
          id: "2",
          title: "Timed event",
          color: "#0097a7",
          start: "2024-12-15T12:00:00",
          end: "2024-12-16T12:00:00",
          custom: "custom stuff",
        },
      ]}
      allDaySlot={false}
      dayHeaderClassNames="text-gray-500 text-sm font-normal"
      titleFormat={{ year: "numeric", month: "long" }}
      dayHeaderContent={function (arg) {
        const date = arg.date.getDate();
        const day = arg.date.toLocaleDateString("en-US", { weekday: "short" });
        const today = new Date().getDate();
        return (
          <div className="flex h-full flex-wrap items-center justify-center gap-1">
            <span>{day}</span>
            {date === today ? (
              <Button className="rounded-full" size="icon">
                {date}
              </Button>
            ) : (
              <span className="font-bold text-primary">{date}</span>
            )}
          </div>
        );
      }}
      customButtons={{
        analyze: {
          text: "Analyze Schedule",
          click: function () {
            alert("Analyze button clicked");
          },
        },
      }}
      headerToolbar={{
        left: "prev,today,next",
        center: "title",
        right: "analyze",
      }}
      slotLabelClassNames="text-gray-400 text-xs"
      drop={(info) => {
        info.draggedEl.parentNode?.removeChild(info.draggedEl);
      }}
    />
  );
}
