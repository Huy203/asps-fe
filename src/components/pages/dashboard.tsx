import { useEffect, useState } from "react";
import { FormTask } from "../organisms/form-task";
import TaskCalendar from "../organisms/task-calendar";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../ui";
import DashboardViewAction from "../organisms/dashboard-view-action";
import { Draggable } from "@fullcalendar/interaction";

const externalEvents = [
  { title: "Art 1", id: 34432, custom: "fdsfdsfds" },
  { title: "Art 2", id: 323232 },
  { title: "Art 3", id: 1111 },
  { title: "Art 4", id: 432432 },
];

export default function DashboardPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    let draggableEl = document.getElementById("external-events");
    if (!draggableEl) return;
    const draggable = new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        let id = eventEl.dataset.id;
        let title = eventEl.getAttribute("title");
        let color = eventEl.dataset.color;
        let custom = eventEl.dataset.custom;

        return {
          id: id,
          title: title,
          color: color,
          custom: custom,
          create: true,
        };
      },
    });

    return () => {
      draggable.destroy();
    };
  }, []);

  return (
    <div className="grid h-screen grid-cols-12 gap-4 p-8 pt-6">
      <div className="col-span-9">
        <DashboardViewAction />
        <TaskCalendar />
      </div>
      <div className="col-span-3 flex flex-col items-end gap-4">
        <Button onClick={() => setIsSheetOpen(true)}>Add Task</Button>
        <FormTask open={isSheetOpen} onOpenChange={setIsSheetOpen} />
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Unestimated Tasks</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1" id="external-events">
            {externalEvents.map((event) => (
              <div
                key={event.id}
                className="fc-event fc-daygrid-event fc-daygrid-block-event bg-blue-50 text-blue-700"
                data-id={event.id}
                data-custom={event.custom}
                title={event.title}
              >
                <div className="fc-event-main">{event.title}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
