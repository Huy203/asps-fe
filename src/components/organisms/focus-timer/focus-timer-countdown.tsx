import { Button } from "@/components/ui";
import { format } from "date-fns";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

type FocusTimerCountDownProps = {
  onClose: () => void;
};
export function FocusTimerCountDown({ onClose }: FocusTimerCountDownProps) {
  const [timeLeft, setTimeLeft] = useState(5);
  const [isRunning, setIsRunning] = useState<boolean | undefined>();
  const [showTick, setShowTick] = useState<boolean | undefined>();

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
    setIsRunning((prev) => !prev);
    setShowTick(isRunning);
  };

  const handleReset = () => {
    setTimeLeft(1500);
    setIsRunning(undefined);
    setShowTick(false);
  };

  const handleSubmit = () => {
    onClose();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mb-8 text-6xl font-bold">{format(timeLeft * 1000, "mm:ss")}</div>
      <div className="flex space-x-4">
        <Button onClick={handleStart} className="rounded-lg px-4 text-white">
          {isRunning === undefined ? "Start" : isRunning ? "Pause" : "Resume"}
        </Button>
        <Button variant="ghost" onClick={handleReset} className="rounded-lg px-4">
          Reset
        </Button>
      </div>
      {(!isRunning || timeLeft === 0) && showTick && (
        <div className="mt-8">
          <Button
            variant="ghost"
            className="rounded-full bg-primary p-4 text-white"
            onClick={handleSubmit}
            aria-label="Submit"
          >
            <Check className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
