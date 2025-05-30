export interface Task {
  id: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  duedate: string;
  status: 'In_Progress' | 'In_Review' | 'On_Hold' | 'Completed';
  category: 'Development' | 'Testing' | 'Bugs';
  description: {
    summary: string;
    details: string;
    acceptanceCriteria: string[];
    notes: string;
  };
}

export interface StatusCounts {
  All: number;
  Completed: number;
  'In Progress': number;
  'In Review': number;
  'On Hold': number;
}

export interface PriorityCounts {
  All: number;
  High: number;
  Medium: number;
  Low: number;
}

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DashboardCardsProps {
  statusCounts: StatusCounts;
}

export interface DragItem {
  id: number;
  status: string;
  priority: string;
  title: string;
  duedate: string;
  category: string;
  description: Task['description'];
}

export interface ColumnProps {
  status: string;
  color: string;
  tasks: Task[];
  moveTask: (taskId: number, newValue: string) => void;
  onEdit: (task: Task) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isPriorityView?: boolean;
}

export interface CreateTaskDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  handleCreateTask: (e: React.FormEvent<HTMLFormElement>) => void;
}

export interface CreateTaskFormProps {
  handleCreateTask: (e: React.FormEvent<HTMLFormElement>) => void;
}

export interface TaskCardProps {
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  duedate: string;
  status: 'In_Progress' | 'In_Review' | 'On_Hold' | 'Completed';
  category: 'Development' | 'Testing' | 'Bugs';
  id: number;
  moveTask: (id: number, status: string) => void;
  isDragging?: boolean;
  description: Task['description'];
  onEdit: (task: Task) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}


export interface TaskFiltersProps {
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

export interface ColumnType {
  label: string;
  color: string;
}

export interface TaskColumnsProps {
  columns: ColumnType[];
  tasks: Task[];
  viewMode: 'status' | 'priority';
  moveTask: (taskId: number, newValue: string) => void;
  onEdit: (task: Task) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

export interface TaskChartsProps {
  tasks: Task[];
}

export 
interface DragState {
  isDragging: boolean;
  draggedTaskId: number | null;
  setDragging: (isDragging: boolean, taskId?: number | null) => void;
}