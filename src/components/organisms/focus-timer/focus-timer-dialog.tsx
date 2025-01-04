import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskStatus } from "@/lib/enums";
import { Task } from "@/lib/types";
import { cn, getEndTimeByDuration } from "@/lib/utils";
import { formatDate } from "@fullcalendar/core/index.js";
import { Dialog } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Separator } from "../../ui";
import { PriorityMapBorderColor, StatusMapColor, StatusMapTextColor } from "../support";
import { FocusTimerCountDown } from "./focus-timer-countdown";

type FocusTimerDialogProps<T extends Task> = {
  info: T;
  setInfo: (info?: T) => void;
};

export function FocusTimerDialog<T extends Task>({ info, setInfo }: FocusTimerDialogProps<T>) {
  const [colorMapping, setColorMapping] = useState({
    priorityColor: "",
    statusTextColor: "",
    statusColor: "",
  });

  useEffect(() => {
    if (info) {
      const priorityColor = PriorityMapBorderColor[info.priorityLevel];
      const statusTextColor = StatusMapTextColor[info.status];
      const statusColor = StatusMapColor[info.status];
      setColorMapping({ priorityColor, statusTextColor, statusColor });
    }
  }, [info]);

  return (
    <Dialog
      open={info !== undefined}
      modal={true}
      onOpenChange={() => {
        setInfo(undefined);
      }}
    >
      <DialogContent
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">{info.name}</DialogTitle>
          <DialogDescription className="mt-1 text-sm text-gray-600">
            {info.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Priority:</span>
            <span
              className={cn(
                "rounded-md px-2 py-1",
                `bg-[${colorMapping.priorityColor}] text-white`
              )}
            >
              {info.priorityLevel}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Status:</span>

            <span
              className={cn(
                `rounded-md px-2 py-1 bg-[${colorMapping.statusColor}] text-[${colorMapping.statusTextColor}]`
              )}
            >
              {Object.entries(TaskStatus).find(([, value]) => value === info.status)?.[0]}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Start Time:</span>
            <span className="text-gray-500">
              {formatDate(info.startTime, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
              })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">End Time:</span>
            <span className="text-gray-500">
              {formatDate(getEndTimeByDuration(new Date(info.startTime), info.estimatedTime), {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
              })}
            </span>
          </div>
        </div>

        <Separator className="mt-1" />

        <FocusTimerCountDown info={info} onClose={() => setInfo(undefined)} />
      </DialogContent>
    </Dialog>
  );
}
