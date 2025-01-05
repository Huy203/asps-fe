import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskStatus } from "@/lib/enums";
import { Task } from "@/lib/types";
import { getEndTimeByDuration } from "@/lib/utils";
import { formatDate } from "@fullcalendar/core";
import { Dialog } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Separator } from "../../ui";
import { PriorityMapBorderColor, StatusMapColor, StatusMapTextColor } from "../support";
import { FocusTimerAlert } from "./focus-timer-alert";
import { FocusTimerCountDown } from "./focus-timer-countdown";

type FocusTimerDialogProps<T extends Task> = {
  info: T;
  setInfo: (info?: T) => void;
};

export function FocusTimerDialog<T extends Task>({ info, setInfo }: FocusTimerDialogProps<T>) {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean | undefined>();

  useEffect(() => {
    const handlePopState = (event: any) => {
      if (isRunning) {
        event.preventDefault();
        window.history.pushState(null, document.title);
        setShowAlert(true);
      }
    };

    if (isRunning) {
      window.history.pushState(null, document.title);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isRunning]);

  return (
    <div>
      {showAlert && (
        <FocusTimerAlert
          isShown={showAlert}
          onConfirm={() => {
            setInfo(undefined);
            setShowAlert(false);
          }}
          onCancel={() => {
            setShowAlert(false);
          }}
        />
      )}
      <Dialog
        open={info !== undefined}
        modal={true}
        onOpenChange={() => {
          if (!isRunning) setInfo(undefined);
          else {
            setShowAlert(true);
            setIsRunning(false);
          }
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
                className="rounded-md px-2 py-1 text-white"
                style={{ backgroundColor: PriorityMapBorderColor[info.priorityLevel] }}
              >
                {info.priorityLevel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">Status:</span>
              <span
                className="rounded-md px-2 py-1"
                style={{
                  backgroundColor: StatusMapColor[info.status],
                  color: StatusMapTextColor[info.status],
                }}
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
          <FocusTimerCountDown
            info={info}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            onClose={() => setInfo(undefined)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
