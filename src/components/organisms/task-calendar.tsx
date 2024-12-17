import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Button } from "../ui";
import interactionPlugin from "@fullcalendar/interaction";
import { Task } from "@/lib/types";
import { PriotityMapBorderColor, StatusMapTextColor, StatusMapColor } from "./support";
import { useUpdateTask } from "@/hooks/react-query/useTasks";
import { TaskStatus } from "@/lib/enums";

export default function TaskCalendar({ tasks }: { tasks: Task[] }) {
  const { mutate } = useUpdateTask();

  const events = tasks
    .filter((task) => task.estimatedTime)
    .map((task) => ({
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
      nowIndicator
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
        const task = tasks.find((task) => task.id === info.draggedEl.dataset.id);
        if (!task) return;
        mutate({
          id: task.id,
          payload: {
            ...task,
            startTime: new Date(info.dateStr),
            estimatedTime: 1,
            status: new Date(info.dateStr) < new Date() ? TaskStatus.Expired : task.status,
          },
        });
      }}
      scrollTime={new Date().getHours() + ":00:00"}
      eventReceive={(info) => {
        info.event.setProp("backgroundColor", info.draggedEl.style.backgroundColor);
        info.event.setProp("borderColor", info.draggedEl.style.borderColor);
        info.event.setProp("textColor", info.draggedEl.style.color);
      }}
      eventDrop={(info) => {
        const task = tasks.find((task) => task.id === info.event.id);
        if (!task) return;
        mutate({
          id: task.id,
          payload: {
            ...task,
            startTime: info.event.start ?? new Date(),
            estimatedTime: task.estimatedTime,
            status:
              info.event.start && info.event.start < new Date() ? TaskStatus.Expired : task.status,
          },
        });
      }}
      eventResize={(info) => {
        const task = tasks.find((task) => task.id === info.event.id);
        if (!task) return;
        mutate({
          id: task.id,
          payload: {
            ...task,
            // in hours
            estimatedTime: Math.round(
              ((info.event.end?.getTime() ?? 0) - (info.event.start?.getTime() ?? 0)) /
                (1000 * 60 * 60)
            ),
          },
        });
      }}
    />
  );
}

const getEndTimeByDuration = (startTime: Date, duration: number) => {
  const date = new Date(startTime);
  date.setHours(date.getHours() + duration);
  return date.toISOString();
};
