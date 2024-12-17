import { useGetTasks } from "@/hooks/react-query/useTasks";
import { Card, CardHeader, CardTitle, CardContent } from "../ui";
import { StatusMapColor, PriotityMapBorderColor, StatusMapTextColor } from "./support";

export default function UnestimatedTasks() {
  const { data: tasks } = useGetTasks();

  const externalEvents =
    tasks
      ?.filter((task) => !task.estimatedTime)
      .map((task) => ({
        id: task.id,
        title: task.name,
        backgroundColor: StatusMapColor[task.status],
        borderColor: PriotityMapBorderColor[task.priorityLevel],
        textColor: StatusMapTextColor[task.status],
      })) || [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Unestimated Tasks</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1" id="external-events">
        {externalEvents.map((event) => (
          <div
            key={event.id}
            className="fc-event fc-daygrid-event fc-daygrid-block-event border-l-4"
            data-id={event.id}
            title={event.title}
            style={{
              backgroundColor: event.backgroundColor,
              borderColor: event.borderColor,
              color: event.textColor,
            }}
          >
            <div className="fc-event-main">{event.title}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
