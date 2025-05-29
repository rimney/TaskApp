'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, BookCheck, Bug, Calendar } from 'lucide-react';
import CreateTaskDialog from './CreateTaskDialog';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface StatusCounts {
  All: number;
  Completed: number;
  'In Progress': number;
  'In Review': number;
  'On Hold': number;
}

interface PriorityCounts {
  All: number;
  High: number;
  Medium: number;
  Low: number;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface TaskFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedPriority: string;
  setSelectedPriority: (value: string) => void;
  selectedDateRange: DateRange;
  setSelectedDateRange: (range: DateRange) => void;
  viewMode: 'status' | 'priority';
  setViewMode: (value: 'status' | 'priority') => void;
  statusCounts: StatusCounts;
  priorityCounts: PriorityCounts;
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  handleCreateTask: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function TaskFilters({
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
  selectedDateRange,
  setSelectedDateRange,
  viewMode,
  setViewMode,
  statusCounts,
  priorityCounts,
  isDialogOpen,
  setIsDialogOpen,
  handleCreateTask,
}: TaskFiltersProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Custom styles to match the theme
  const css = `
    .rdp {
      --rdp-background-color: #171818;
      --rdp-accent-color: #CAFE14;
      --rdp-selected-color: #171818;
      --rdp-selected-bg-color: #CAFE14;
      --rdp-hover-bg-color: #2a2b2b;
      --rdp-border-color: #ffffff;
      background-color: var(--rdp-background-color);
      // border: 1px solid var(--rdp-border-color);
      border-radius: 9px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 8px;
    }
    .rdp-month_grid 
    {
      color : #CAFE14;
    }
    .rdp-caption_label {
      color: #CAFE14;
      font-size: 1rem;
    }
    .rdp-head_cell {
      color: #CAFE14 !important; /* Ensure day headers (Su Mo Tu We Th Fr Sa) are #CAFE14 */
      font-size: 0.875rem;
      font-weight: 500;
    }
    .rdp-day {
      color: #e5e7eb; /* Ensure unselected days are visible */
      border-radius: 9px;
      transition: all 0.3s ease;
    }
    .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled) {
      background-color: var(--rdp-hover-bg-color);
    }
    .rdp-day_selected, .rdp-day_selected:hover {
      background-color: var(--rdp-selected-bg-color); /* #CAFE14 */
      color: #171818 !important; /* Ensure black text for green background */
      // border: 1px solid var(--rdp-border-color);
      border-radius: 9px;
    }
    .rdp-nav_button {
      color: #CAFE14;
      // border: 1px solid var(--rdp-border-color);
      border-radius: 9px;
      padding: 4px;
    }
    .rdp-nav_button:hover {
      background-color: var(--rdp-hover-bg-color);
    }
    .rdp-day_range_middle {
      background-color: #CAFE1436;
      color: #e5e7eb;
    }
      .rdp-caption_label {
      margin-left : 12px;
      }
    .rdp-day_range_start, .rdp-day_range_end {
      background-color: var(--rdp-selected-bg-color); /* #CAFE14 */
      color: #171818 !important; /* Ensure black text for green background */
      border-radius: 9px;

    }
  `;

  return (
    <Card className="bg-[#171818] border border-white shadow-lg">
      <style>{css}</style>
      <CardHeader>
        <CardTitle className="text-[#CAFE14]">Tasks</CardTitle>
        <CardDescription className="text-gray-300">Manage your tasks here</CardDescription>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant={viewMode === 'status' ? 'default' : 'outline'}
            className={`${
              viewMode === 'status'
                ? 'bg-[#CAFE14] text-[#171818] shadow-[4px_5px_0px_0px_#ffffff] hover:bg-white border border-black hover:text-black hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)]'
                : 'bg-[#CAFE1436] text-[#CAFE14] border border-white hover:bg-[#CAFE14] hover:text-[#171818] hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)]'
            } transition-all duration-300 cursor-pointer`}
            onClick={() => setViewMode('status')}
          >
            Status View
          </Button>
          <Button
            variant={viewMode === 'priority' ? 'default' : 'outline'}
            className={`${
              viewMode === 'priority'
                ? 'bg-[#CAFE14] text-[#171818] shadow-[4px_5px_0px_0px_#ffffff] border border-black hover:bg-white hover:text-black hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)]'
                : 'bg-[#CAFE1436] text-[#CAFE14] border border-white hover:bg-[#CAFE14] hover:text-[#171818] hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)]'
            } transition-all duration-300 cursor-pointer`}
            onClick={() => setViewMode('priority')}
          >
            Priority View
          </Button>
          <CreateTaskDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleCreateTask={handleCreateTask}
          />
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={selectedDateRange.startDate || selectedDateRange.endDate ? 'default' : 'outline'}
                className={`flex items-center gap-2 ${
                  selectedDateRange.startDate || selectedDateRange.endDate
                    ? 'bg-[#CAFE14] text-[#171818] shadow-[4px_5px_0px_0px_#ffffff] hover:bg-white border border-black hover:text-black hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)]'
                    : 'bg-[#CAFE1436] text-[#CAFE14] border border-white hover:bg-[#CAFE14] hover:text-[#171818] hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)]'
                } transition-all duration-300 cursor-pointer h-[36px] text-sm sm:text-base px-3`}
              >
                <Calendar className="w-4 h-4" />
                {selectedDateRange.startDate
                  ? selectedDateRange.endDate
                    ? `${format(selectedDateRange.startDate, 'MM/dd/yyyy')} - ${format(selectedDateRange.endDate, 'MM/dd/yyyy')}`
                    : format(selectedDateRange.startDate, 'MM/dd/yyyy')
                  : 'Select Dates'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-[#171818] border border-white shadow-lg p-0 w-auto">
              <DayPicker
                mode="range"
            // @ts-expect-error unknown type error

                selected={{ from: selectedDateRange.startDate, to: selectedDateRange.endDate }}
                onSelect={(range) => {
                  setSelectedDateRange({ startDate: range?.from || null, endDate: range?.to || null });
                  if (range?.from && range?.to) {
                    setIsCalendarOpen(false);
                  }
                }}
                className="rdp"
                modifiersClassNames={{
                  selected: 'rdp-day_selected',
                  range_start: 'rdp-day_range_start',
                  range_end: 'rdp-day_range_end',
                  range_middle: 'rdp-day_range_middle',
                }}
                showOutsideDays
                fixedWeeks
              />
            </PopoverContent>
          </Popover>
          {selectedDateRange.startDate || selectedDateRange.endDate ? (
            <Button
              variant="outline"
              className="bg-[#CAFE1436] text-[#CAFE14] border border-white hover:bg-[#CAFE14] hover:text-[#171818] hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)] transition-all duration-300 cursor-pointer h-[36px] text-sm sm:text-base px-3"
              onClick={() => setSelectedDateRange({ startDate: null, endDate: null })}
            >
              Clear Dates
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full flex flex-wrap items-center gap-2">
          {[
            { label: 'All', icon: null },
            { label: 'Development', icon: <Code color={selectedCategory === 'Development' ? 'black' : 'white'} className="mt-[3px] text-[#CAFE14]" /> },
            { label: 'Testing', icon: <BookCheck color={selectedCategory === 'Testing' ? 'black' : 'white'} className="mt-[3px] text-[#CAFE14]" /> },
            { label: 'Bugs', icon: <Bug color={selectedCategory === 'Bugs' ? 'black' : 'white'} className="mt-[3px] text-[#CAFE14]" /> },
          ].map((category) => (
            <Badge
              key={category.label}
              className={`flex items-center justify-center gap-2 h-[30px] rounded-[12px] border border-white cursor-pointer text-sm sm:text-base ${
                selectedCategory === category.label
                  ? 'bg-[#CAFE14] text-[#171818]'
                  : 'bg-[#171818] text-gray-300 hover:bg-[#2a2b2b]'
              } min-w-[80px] sm:w-[85px] ${category.label === 'Development' ? 'sm:w-[150px]' : category.label === 'Testing' ? 'sm:w-[110px]' : ''}`}
              onClick={() => setSelectedCategory(category.label)}
            >
              <span>{category.label}</span>
              {category.icon}
            </Badge>
          ))}
        </div>
        {viewMode === 'priority' && (
          <div className="w-full flex flex-wrap items-center gap-2 mt-3">
            {[
              { label: 'All', count: statusCounts.All, color: '#FFFFFF' },
              { label: 'Completed', count: statusCounts.Completed, color: '#5DD66A' },
              { label: 'In Progress', count: statusCounts['In Progress'], color: '#9d9bfe' },
              { label: 'In Review', count: statusCounts['In Review'], color: '#ECA7FE' },
              { label: 'On Hold', count: statusCounts['On Hold'], color: '#F6BC54' },
            ].map((status) => (
              <Badge
                key={status.label}
                className={`flex items-center justify-center gap-2 h-[30px] rounded-[12px] border border-white cursor-pointer text-sm sm:text-base ${
                  selectedStatus === status.label
                    ? 'bg-[#CAFE14] text-[#171818]'
                    : 'bg-[#171818] text-gray-300 hover:bg-[#2a2b2b]'
                } min-w-[90px] sm:w-[100px] ${status.label === 'Completed' || status.label === 'In Progress' ? 'sm:w-[140px]' : status.label === 'In Review' ? 'sm:w-[130px]' : status.label === 'On Hold' ? 'sm:w-[120px]' : ''}`}
                onClick={() => setSelectedStatus(status.label)}
              >
                <span>{status.label}</span>
                <div
                  className="w-[25px] sm:w-[35px] h-[25px] flex items-center justify-center rounded-full border border-white"
                  style={{ backgroundColor: status.label === 'All' && selectedStatus !== 'All' ? '#171818' : selectedStatus === status.label ? '#FFFFFF' : status.color }}
                >
                  <span className={`text-xs sm:text-sm ${status.label === 'All' && selectedStatus !== 'All' ? 'text-gray-300' : selectedStatus === status.label ? 'text-[#171818]' : 'text-black'}`}>
                    {status.count}
                  </span>
                </div>
              </Badge>
            ))}
          </div>
        )}
        {viewMode === 'status' && (
          <div className="w-full flex flex-wrap items-center gap-2 mt-3">
            {[
              { label: 'All', count: priorityCounts.All, color: '#FFFFFF' },
              { label: 'High', count: priorityCounts.High, color: '#FEAFB2' },
              { label: 'Medium', count: priorityCounts.Medium, color: '#F6BE55' },
              { label: 'Low', count: priorityCounts.Low, color: '#5CD767' },
            ].map((priority) => (
              <Badge
                key={priority.label}
                className={`flex items-center justify-center gap-2 h-[30px] rounded-[12px] border border-white cursor-pointer text-sm sm:text-base ${
                  selectedPriority === priority.label
                    ? 'bg-[#CAFE14] text-[#171818]'
                    : 'bg-[#171818] text-gray-300 hover:bg-[#2a2b2b]'
                } w-[90px] sm:w-[100px] ${priority.label === 'Medium' ? 'sm:w-[120px]' : priority.label === 'High' ? 'sm:w-[110px]' : ''}`}
                onClick={() => setSelectedPriority(priority.label)}
              >
                <span>{priority.label}</span>
                <div
                  className="w-[25px] sm:w-[35px] h-[25px] flex items-center justify-center rounded-full border border-white"
                  style={{ backgroundColor: priority.label === 'All' && selectedPriority !== 'All' ? '#171818' : selectedPriority === priority.label ? '#FFFFFF' : priority.color }}
                >
                  <span className={`text-xs sm:text-sm ${priority.label === 'All' && selectedStatus !== 'All' ? 'text-gray-300' : selectedPriority === priority.label ? 'text-[#171818]' : 'text-black'}`}>
                    {priority.count}
                  </span>
                </div>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}