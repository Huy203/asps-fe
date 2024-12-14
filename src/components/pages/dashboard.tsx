import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Button, Card, CardHeader, CardTitle } from "../ui";
import { renderToString } from "react-dom/server";

export default function DashboardPage() {
  return (
    <div className="grid h-screen grid-cols-12 gap-4 p-8 pt-6">
      <div className="col-span-9">
        <FullCalendar
          editable
          droppable
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          events={[
            { title: "event 1", date: "2024-12-13" },
            { title: "event 2", date: "2024-12-13" },
          ]}
          allDaySlot={false}
          dayHeaderClassNames="text-gray-500 text-sm font-normal"
          titleFormat={{ year: "numeric", month: "long" }}
          dayHeaderDidMount={function (arg) {
            const date = arg.date.getDate();
            const day = arg.date.toLocaleDateString("en-US", { weekday: "short" });
            arg.el.innerHTML = renderToString(
              <div className="flex h-full items-center justify-center gap-1">
                <span>{day}</span>
                <span className="font-bold text-primary">{date}</span>
              </div>
            );
          }}
        />
      </div>
      <div className="col-span-3 flex flex-col items-end gap-4">
        <Button>Add Task</Button>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Unscheduled Tasks</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
