import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, BookCheck, Bug } from 'lucide-react';
import CreateTaskDialog from './CreateTaskDialog';

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

interface TaskFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedPriority: string;
  setSelectedPriority: (value: string) => void;
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
  viewMode,
  setViewMode,
  statusCounts,
  priorityCounts,
  isDialogOpen,
  setIsDialogOpen,
  handleCreateTask,
}: TaskFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>Manage your tasks here</CardDescription>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant={viewMode === 'status' ? 'default' : 'outline'}
            onClick={() => setViewMode('status')}
          >
            Status View
          </Button>
          <Button
            variant={viewMode === 'priority' ? 'default' : 'outline'}
            onClick={() => setViewMode('priority')}
          >
            Priority View
          </Button>
          <CreateTaskDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleCreateTask={handleCreateTask}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full flex flex-wrap items-center gap-2">
          {[
            { label: 'All', icon: null },
            { label: 'Development', icon: <Code className="mt-[3px]" /> },
            { label: 'Testing', icon: <BookCheck className="mt-[3px]" /> },
            { label: 'Bugs', icon: <Bug className="mt-[3px]" /> },
          ].map((category) => (
            <Badge
              key={category.label}
              className={`flex items-center justify-center gap-2 h-[30px] rounded-[12px] border border-black cursor-pointer text-sm sm:text-base ${
                selectedCategory === category.label
                  ? 'bg-[#181818] text-white'
                  : 'bg-[#FFFFFF] text-black border border-black'
              } min-w-[90px] sm:w-[150px] ${category.label === 'Development' ? 'sm:w-[140px]' : category.label === 'Testing' ? 'sm:w-[110px]' : ''}`}
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
                className={`flex items-center justify-center gap-2 h-[30px] rounded-[12px] border border-black cursor-pointer text-sm sm:text-base ${
                  selectedStatus === status.label
                    ? 'bg-[#181818] text-white'
                    : 'text-black border border-black'
                } min-w-[90px] sm:w-[100px] ${status.label === 'Completed' || status.label === 'In Progress' ? 'sm:w-[140px]' : status.label === 'In Review' ? 'sm:w-[130px]' : status.label === 'On Hold' ? 'sm:w-[120px]' : ''}`}
                style={{ backgroundColor: status.label === 'All' && selectedStatus !== 'All' ? '#FFFFFF' : selectedStatus === status.label ? '#181818' : status.color }}
                onClick={() => setSelectedStatus(status.label)}
              >
                <span>{status.label}</span>
                <div
                  className="w-[25px] sm:w-[35px] h-[25px] flex items-center justify-center rounded-full"
                  style={{ backgroundColor: status.label === 'All' && selectedStatus !== 'All' ? '#000000' : selectedStatus === status.label ? '#FFFFFF' : status.color }}
                >
                  <span className={`text-xs sm:text-sm ${status.label === 'All' && selectedStatus !== 'All' ? 'text-white' : 'text-black'}`}>
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
                className={`flex items-center justify-center gap-2 h-[30px] rounded-[12px] border border-black cursor-pointer text-sm sm:text-base ${
                  selectedPriority === priority.label
                    ? 'bg-[#181818] text-white'
                    : 'text-black border border-black'
                } w-[90px] sm:w-[100px] ${priority.label === 'Medium' ? 'sm:w-[120px]' : priority.label === 'High' ? 'sm:w-[110px]' : ''}`}
                style={{ backgroundColor: priority.label === 'All' && selectedPriority !== 'All' ? '#FFFFFF' : selectedPriority === priority.label ? '#181818' : priority.color }}
                onClick={() => setSelectedPriority(priority.label)}
              >
                <span>{priority.label}</span>
                <div
                  className="w-[25px] sm:w-[35px] h-[25px] flex items-center justify-center rounded-full"
                  style={{ backgroundColor: priority.label === 'All' && selectedPriority !== 'All' ? '#000000' : selectedPriority === priority.label ? '#FFFFFF' : priority.color }}
                >
                  <span className={`text-xs sm:text-sm ${priority.label === 'All' && selectedPriority !== 'All' ? 'text-white' : 'text-black'}`}>
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