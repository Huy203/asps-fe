import { Button } from "@/components/ui";
import { formatTime } from "@/lib/utils";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import { useUpdateTask } from "@/hooks/react-query/useTasks";
import { Task } from "@/lib/types";

type FocusTimerCountDownProps = {
  info: Task;
  onClose: () => void;
};

const DurationTimer = 3600;

export function FocusTimerCountDown({ info, onClose }: FocusTimerCountDownProps) {
  const [timeLeft, setTimeLeft] = useState(DurationTimer);
  const [isRunning, setIsRunning] = useState<boolean | undefined>();
  const [showTick, setShowTick] = useState<boolean | undefined>();

  const [startAt, setStartAt] = useState<Date>();

  const { mutate: updateMutate, isPending: updatePending } = useUpdateTask();

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
        if (timeLeft === 0) {
          // TODO: Add notification
          handleReset();
          setShowTick(true);
        }
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [timeLeft, isRunning]);

  const handleStart = () => {
    if (isRunning === undefined) {
      setStartAt(new Date());
    }
    setIsRunning((prev) => !prev);
    setShowTick(isRunning);
  };

  const handleReset = () => {
    setTimeLeft(1500);
    setIsRunning(undefined);
    setShowTick(false);
    setStartAt(undefined);
  };

  const onSubmit = () => {
    updateMutate({
      id: info.id,
      payload: {
        ...info,
        focusDurations: [
          ...(info.focusDurations || []),
          {
            start: startAt!,
            duration: DurationTimer - timeLeft,
          },
        ],
      },
    });
    onClose();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mb-8 text-6xl font-bold">{formatTime(timeLeft)}</div>
      <div className="flex space-x-4">
        <Button
          onClick={handleStart}
          disabled={updatePending}
          className="rounded-lg px-4 text-white"
        >
          {isRunning === undefined ? "Start" : isRunning ? "Pause" : "Resume"}
        </Button>
        <Button
          variant="ghost"
          onClick={handleReset}
          disabled={updatePending}
          className="rounded-lg px-4"
        >
          Reset
        </Button>
      </div>
      {(!isRunning || timeLeft === 0) && showTick && (
        <div className="mt-8">
          <Button
            variant="ghost"
            className="rounded-full bg-primary p-4 text-white"
            onClick={onSubmit}
            disabled={updatePending}
          >
            <Check className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
