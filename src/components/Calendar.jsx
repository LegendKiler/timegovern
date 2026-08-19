import { useState } from "react";
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow h-full">
      <div className="flex items-center justify-between p-6 pb-4">
        <h3 className="font-semibold leading-none tracking-tight">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="h-8 px-3 text-xs rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {weekDays.map((d) => (
            <div key={d} className="py-2 text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, today);
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-md text-sm",
                  !isCurrentMonth && "text-muted-foreground opacity-40",
                  isToday && "bg-primary text-primary-foreground font-semibold",
                  !isToday && isCurrentMonth && "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
