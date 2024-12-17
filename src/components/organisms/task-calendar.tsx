import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Button } from "../ui";
import interactionPlugin from "@fullcalendar/interaction";
import { Task } from "@/lib/types";
import { TaskPriority, TaskStatus } from "@/lib/enums";

export default function TaskCalendar({ tasks }: { tasks: Task[] }) {
  const events = tasks.map((task) => ({
    id: task.id,
    title: task.name,
    start: task.startTime,
    end: getEndTimeByDuration(task.startTime, task.estimatedTime),
    borderColor: PriotityMapBorderColor[task.priorityLevel],
    textColor: StatusMapTextColor[task.status],
    backgroundColor: StatusMapColor[task.status],
  }));

  return (
    <FullCalendar
      editable
      droppable
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      events={events}
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
        right: "prev,today,next",
      }}
      slotLabelClassNames="text-gray-400 text-xs"
      drop={(info) => {
        info.draggedEl.parentNode?.removeChild(info.draggedEl);
      }}
      scrollTime={new Date().getHours() + ":00:00"}
      eventDrop={(info) => {
        console.log(info);
      }}
    />
  );
}

const getEndTimeByDuration = (startTime: Date, duration: number) => {
  const date = new Date(startTime);
  date.setHours(date.getHours() + duration);
  return date.toISOString();
};

const PriotityMapBorderColor: Record<TaskPriority, string> = {
  [TaskPriority.High]: "#ef4444",
  [TaskPriority.Medium]: "#eab308",
  [TaskPriority.Low]: "#3b82f6",
};

const StatusMapTextColor: Record<TaskStatus, string> = {
  [TaskStatus["To do"]]: "rgb(51 65 85)",
  [TaskStatus["In progress"]]: "rgb(29 78 216)",
  [TaskStatus.Completed]: "#15803d",
  [TaskStatus.Expired]: "#b91c1c",
};

const StatusMapColor: Record<TaskStatus, string> = {
  [TaskStatus["To do"]]: "rgb(248 250 252)",
  [TaskStatus["In progress"]]: "rgb(239 246 255)",
  [TaskStatus.Completed]: "#f0fdf4",
  [TaskStatus.Expired]: "#fef2f2",
};
