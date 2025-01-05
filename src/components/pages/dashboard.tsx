import { useGetFeedback } from "@/hooks/react-query/useAI";
import { useGetTasks } from "@/hooks/react-query/useTasks";
import { Draggable } from "@fullcalendar/interaction";
import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { ThreeDotsLoader } from "../mocules/three-dot-loader";
import TaskCalendar from "../organisms/task-calendar";
import UnestimatedTasks from "../organisms/unestimated-tasks";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../ui";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

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

  return (
    <div className="grid h-screen grid-cols-1 gap-4 p-4 pt-6 md:grid-cols-12 md:p-8">
      <div className="md:col-span-9">
        {taskPending ? (
          <ThreeDotsLoader />
        ) : tasks ? (
          <TaskCalendar tasks={tasks} />
        ) : (
          <div>No tasks found</div>
        )}
      </div>
      <div className="flex flex-col items-end gap-4 md:col-span-3">
        <Button onClick={() => setGetFeedback(true)}>Analyze Schedule</Button>
        <UnestimatedTasks />
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
