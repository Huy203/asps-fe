import { useEffect, useState } from "react";
import TaskCalendar from "../organisms/task-calendar";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../ui";
import { Draggable } from "@fullcalendar/interaction";
import { useGetFeedback } from "@/hooks/react-query/useAI";
import { ThreeDotsLoader } from "../mocules/three-dot-loader";
import { Terminal } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { useGetTasks } from "@/hooks/react-query/useTasks";

export default function DashboardPage() {
  const [getFeedback, setGetFeedback] = useState(false);
  const { data: feedback, isPending: feedbackPending } = useGetFeedback(getFeedback);
  const { data: tasks, isPending: taskPending } = useGetTasks();

  useEffect(() => {
    const draggableEl = document.getElementById("external-events");
    if (!draggableEl) return;
    const draggable = new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        const id = eventEl.dataset.id;
        const title = eventEl.getAttribute("title");
        const color = eventEl.dataset.color;
        const custom = eventEl.dataset.custom;

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

  const externalEvents =
    tasks
      ?.filter((task) => !task.estimatedTime)
      .map((task) => ({
        id: task.id,
        title: task.name,
      })) || [];

  return (
    <div className="grid h-screen grid-cols-12 gap-4 p-8 pt-6">
      <div className="col-span-9">
        {taskPending ? (
          <ThreeDotsLoader />
        ) : tasks ? (
          <TaskCalendar tasks={tasks} />
        ) : (
          <div>No tasks found</div>
        )}
      </div>
      <div className="col-span-3 flex flex-col items-end gap-4">
        <Button onClick={() => setGetFeedback(true)}>Analyze Schedule</Button>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Unestimated Tasks</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1" id="external-events">
            {externalEvents.map((event) => (
              <div
                key={event.id}
                className="fc-event fc-daygrid-event fc-daygrid-block-event bg-slate-50 text-slate-700"
                data-id={event.id}
                title={event.title}
              >
                <div className="fc-event-main">{event.title}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>AI Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {getFeedback ? (
              feedbackPending ? (
                <ThreeDotsLoader />
              ) : (
                <div className="flex flex-col gap-1">
                  <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Recommendations!</AlertTitle>
                    <AlertDescription>{feedback?.recommendations}</AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Warning!</AlertTitle>
                    <AlertDescription>
                      {feedback?.warnings || "There's no warnings"}
                    </AlertDescription>
                  </Alert>
                </div>
              )
            ) : (
              <div className="text-sm text-neutral-400">
                Click "Analyze Schedule" button above to get feedback
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
