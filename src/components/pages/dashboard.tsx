import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { X } from "lucide-react";
import { useState } from "react";
import { renderToString } from "react-dom/server";
import { FormTask } from "../organisms/form-task";
import { Button, Card, CardHeader, CardTitle } from "../ui";

export default function DashboardPage() {
  const [addingTask, setAddingTask] = useState(false);

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
        <Button onClick={() => setAddingTask(true)}>Add Task</Button>
        {addingTask ? (
          <div
            className={`fixed right-0 top-0 z-50 h-full bg-white p-4 shadow-lg transition-transform duration-300 ease-in-out ${
              addingTask ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="mb-4 flex items-center justify-between border-b">
              <h2 className="text-lg font-semibold">Task Details</h2>

              <Button variant="link" onClick={() => setAddingTask(false)}>
                <X />
              </Button>
            </div>

            <FormTask onTaskAdded={() => setAddingTask(false)} />
          </div>
        ) : (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Add Task</CardTitle>
            </CardHeader>
          </Card>
          /* Task List */
        )}
      </div>
    </div>
  );
}
