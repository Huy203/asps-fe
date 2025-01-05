import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { PagedData, PagingSchema } from "@/lib/types/pagination.type";
import { intervalToDuration } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateSearchParams = (
  data: Record<string, string | string[] | number | boolean | undefined>
) => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          if (val !== "") {
            params.append(key, val.toString());
          }
        });
      } else {
        params.append(key, value.toString());
      }
    }
  }

  return params.toString();
};

export const fromOffsetToPage = <T, K extends string>(value: PagedData<T, K>) => {
  if (!value.offset || !value.limit) return { page: 1, pageSize: 10 };
  return {
    page: Math.ceil(value.offset / value.limit) + 1,
    pageSize: value.limit,
  };
};

export const fromPageToOffset = (value: PagingSchema) => {
  return {
    offset: (value.page - 1) * value.pageSize,
    limit: value.pageSize,
  };
};

export const getEndTimeByDuration = (startTime: Date, duration: number) => {
  const date = new Date(startTime);
  date.setHours(date.getHours() + duration);
  return date.toISOString();
};

export const formatTime = (seconds: number, format: "hour" | "min" | "second" = "hour") => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  const hours = String(duration.hours || 0).padStart(2, "0");
  const minutes = String(duration.minutes || 0).padStart(2, "0");
  const secs = String(duration.seconds || 0).padStart(2, "0");

  switch (format) {
    case "hour":
      return `${hours}:${minutes}:${secs}`;
    case "min":
      return `${minutes}:${secs}`;
    case "second":
      return `${secs}`;
    default:
      return `${hours}:${minutes}:${secs}`;
  }
};
