import { useCallback, useEffect, useRef, useState } from "react";

import { formatTime } from "@/lib/utils";

function useCountdown(initialTime: number, onChangeTime?: (time: number) => void) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const endTimeRef = useRef(Date.now() + initialTime * 1000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pausedTimeRef = useRef<number | null>(timeLeft);

  const updateTimer = useCallback(() => {
    const now = Date.now();
    const timeLeft = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
    setTimeLeft(timeLeft);
    if (onChangeTime) {
      onChangeTime(timeLeft);
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(updateTimer, 1000);
      updateTimer(); // Initial call to set the correct time immediately
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateTimer, isRunning]);

  const restart = useCallback(() => {
    endTimeRef.current = Date.now() + initialTime * 1000;
    setTimeLeft(initialTime);
    setIsRunning(true);
    pausedTimeRef.current = null;
  }, [initialTime]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const pause = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      pausedTimeRef.current = timeLeft;
    }
  }, [isRunning, timeLeft]);

  const resume = useCallback(() => {
    if (!isRunning && pausedTimeRef.current !== null) {
      setIsRunning(true);
      endTimeRef.current = Date.now() + pausedTimeRef.current * 1000;
      pausedTimeRef.current = null;
    }
  }, [isRunning]);

  return {
    time: formatTime(timeLeft, "min"),
    restart,
    stop,
    pause,
    resume,
    timeLeft,
    isEnd: timeLeft === 0,
  };
}

export default useCountdown;
