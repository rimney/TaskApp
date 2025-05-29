'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { MultiBackend, createTransition } from 'react-dnd-multi-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { getSupabaseFrontendClient } from '@/lib/client';
import DashboardCards from '@/components/DashboardCards';
import TaskCharts from '@/components/TaskCharts';
import TaskFilters from '@/components/TaskFilters';
import TaskColumns from '@/components/TaskColumns';
import LogoutButton from '@/components/LogoutButton';
import { DragLayer } from '@/components/DragLayer';

// Define the transition to switch between HTML5 and Touch backends
const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: createTransition('mousedown', (event) => 
        // @ts-expect-error Property 'buttons' does not exist on type 'Event'.ts(2339)
        !!event.buttons),
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: { enableMouseEvents: true, delayTouchStart: 50 },
      transition: createTransition('touchstart', () => true),
    },
  ],
};

interface Task {
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

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [viewMode, setViewMode] = useState<'status' | 'priority'>('status');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = getSupabaseFrontendClient();
  const axiosAuth = useAxiosAuth();

  // Check session and validate token
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log('Session:', data);

      if (!data.session) {
        router.push('/login');
        return;
      }

      try {
        const response = await axiosAuth.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/protected`);
        console.log('Token validation response:', response.data);
        const taskResponse = await axiosAuth.get('/tasks');
        taskResponse.data.map((task: Task) => {
          task.duedate = task.duedate.split('T')[0];
        });
        setTasks(taskResponse.data);
        toast.success('Tasks fetched successfully!');
      } catch (error: unknown) { 
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Create task error:', errorMessage);
        toast.error(errorMessage || 'Failed to fetch tasks');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [router, supabase, axiosAuth]);

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const {
        title,
        priority = 'Medium',
        summary = '',
        duedate = '',
        status = 'In_Progress',
        category = 'Development',
        details = '',
        acceptanceCriteria = '',
        notes = '',
      } = Object.fromEntries(formData);
      const newTask: Omit<Task, 'id'> = {
        title: title as string,
        priority: priority as 'High' | 'Medium' | 'Low',
        duedate: duedate as string,
        status: (status as string).replace(' ', '_') as Task['status'],
        category: category as 'Development' | 'Testing' | 'Bugs',
        description: {
          summary: summary as string,
          details: details as string,
          acceptanceCriteria: (acceptanceCriteria as string).split('\n').filter((item) => item.trim() !== ''),
          notes: notes as string,
        },
      };
      const response = await axiosAuth.post('/tasks', newTask);
      setTasks((prev) => [...prev, response.data]);
      setIsDialogOpen(false);
      toast.success(`Task "${newTask.title}" created successfully!`);
    } catch (error: unknown) { // Changed from Error to unknown
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Create task error:', errorMessage);
      toast.error(errorMessage || 'Failed to create task');
    }
  };
  const handleEditTask = async (updatedTask: Task) => {
    try {
      const payload = {
        ...updatedTask,
        status: updatedTask.status.replace(' ', '_') as Task['status'],
      };
      const response = await axiosAuth.patch(`/tasks/${updatedTask.id}`, payload);
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? response.data : t))
      );
      toast.success(`Task "${updatedTask.title}" updated successfully!`);
    } catch (error: unknown) { // Changed from Error to unknown
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Edit task error:', errorMessage);
      toast.error(errorMessage || 'Failed to update task');
    }
  };
  const handleDeleteTask = async (taskId: number) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      await axiosAuth.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success(`Task "${task?.title || taskId}" deleted successfully!`);
    } catch (error: unknown) { // Changed from Error to unknown
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Delete task error:', errorMessage);
      toast.error(errorMessage || 'Failed to delete task');
    }
  };
  const moveTask = async (taskId: number, newValue: string) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (!taskToUpdate) {
      toast.error('Task not found');
      return;
    }

    const currentValue = viewMode === 'status' ? taskToUpdate.status.replace('_', ' ') : taskToUpdate.priority;
    if (currentValue === newValue) {
      console.log('Task dropped in the same column, no action taken.');
      return;
    }

    const validTransitions: { [key: string]: string[] } = {
      'In Progress': ['In Review', 'Completed', 'On Hold'],
      'In Review': ['Completed', 'On Hold'],
      'On Hold': ['In Progress', 'In Review', 'Completed'],
      'Completed': ['In Progress', 'In Review'],
    };

    if (viewMode === 'status') {
      const currentStatus = taskToUpdate.status.replace('_', ' ');
      const allowedStatuses = validTransitions[currentStatus] || [];
      if (!allowedStatuses.includes(newValue)) {
        toast.error(`Invalid transition: Cannot move from ${currentStatus} to ${newValue}`);
        return;
      }
    }

    const updatedTask: Task = {
      ...taskToUpdate,
      ...(viewMode === 'status'
        ? { status: newValue.replace(' ', '_') as Task['status'] }
        : { priority: newValue as Task['priority'] }),
    };

    try {
      const payload = {
        ...updatedTask,
        status: updatedTask.status.replace(' ', '_') as Task['status'],
      };
      await axiosAuth.patch(`/tasks/${taskId}`, payload);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      );
      const newValueDisplay = viewMode === 'status' ? newValue : newValue;
      toast.success(`Task "${taskToUpdate.title}" moved to ${newValueDisplay}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Delete task error:', errorMessage);
      toast.error(errorMessage || 'Failed to Move task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesPriority =
      viewMode === 'status' ? selectedPriority === 'All' || task.priority === selectedPriority : true;
    const matchesStatus =
      viewMode === 'priority' ? selectedStatus === 'All' || task.status.replace('_', ' ') === selectedStatus : true;
    const matchesDateRange = !selectedDateRange.startDate || !selectedDateRange.endDate
      ? true
      : (() => {
        const taskDate = new Date(task.duedate);
        const startDate = new Date(selectedDateRange.startDate!);
        const endDate = new Date(selectedDateRange.endDate!);
        // Ensure dates are compared without time components
        taskDate.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return taskDate >= startDate && taskDate <= endDate;
      })();
    return matchesCategory && matchesPriority && matchesStatus && matchesDateRange;
  });

  const statusCounts: StatusCounts = {
    All: tasks.length,
    Completed: tasks.filter((task) => task.status === 'Completed').length,
    'In Progress': tasks.filter((task) => task.status === 'In_Progress').length,
    'In Review': tasks.filter((task) => task.status === 'In_Review').length,
    'On Hold': tasks.filter((task) => task.status === 'On_Hold').length,
  };

  const priorityCounts: PriorityCounts = {
    All: tasks.length,
    High: tasks.filter((task) => task.priority === 'High').length,
    Medium: tasks.filter((task) => task.priority === 'Medium').length,
    Low: tasks.filter((task) => task.priority === 'Low').length,
  };

  const columns =
    viewMode === 'status'
      ? [
        { label: 'In Progress', color: '#9d9bfe' },
        { label: 'In Review', color: '#ECA7FE' },
        { label: 'Completed', color: '#5DD66A' },
        { label: 'On Hold', color: '#F6BC54' },
      ]
      : [
        { label: 'High', color: '#FEAFB2' },
        { label: 'Medium', color: '#F6BE55' },
        { label: 'Low', color: '#5CD767' },
      ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col bg-[#171818]">
        <div className='w-auto h-[70px] flex items-center justify-center'>
          <img src="https://framerusercontent.com/images/vsdu0muTZsCIA7B6kX4sGvniM.svg?scale-down-to=1024" className='w-[370px]' alt="" />
        </div>
        <div className="relative flex flex-col items-center justify-center w-full max-w-md p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <h2 className="text-[#CAFE14] text-2xl font-semibold animate-pulse">
              Loading tasks...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <DragLayer />
      <div className="w-full min-h-screen bg-[#171818] flex items-center justify-center px-4 sm:px-6">
        <Tabs defaultValue="dashboard" className="w-full max-w-[1400px] mt-6 sm:mt-10">
          <LogoutButton />
          <TabsList className="grid w-full rounded-[13px] grid-cols-2 bg-[#171818]">
            <TabsTrigger
              value="dashboard"
              className="text-gray-300 cursor-pointer data-[state=active]:text-[black] data-[state=inactive]:text-[#CAFE14] data-[state=active]:bg-[#CAFE14] data-[state=active]:border data-[state=active]:border-black"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="text-gray-300 cursor-pointer data-[state=active]:text-[black] data-[state=inactive]:text-[#CAFE14] data-[state=active]:bg-[#CAFE14] data-[state=active]:border data-[state=active]:border-black"
            >
              Tasks
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="bg-[#171818] border border-white rounded-lg shadow-lg p-6">
            <DashboardCards statusCounts={statusCounts} />
            <TaskCharts tasks={tasks} />
          </TabsContent>
          <TabsContent value="tasks" className="bg-[#171818] border border-white rounded-lg shadow-lg p-6">
            <TaskFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedPriority={selectedPriority}
              setSelectedPriority={setSelectedPriority}
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
              viewMode={viewMode}
              setViewMode={setViewMode}
              statusCounts={statusCounts}
              priorityCounts={priorityCounts}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              handleCreateTask={handleCreateTask}
            />
            <div className="overflow-y-auto max-h-[70vh]" data-scroll-container="tasks-parent">
              <TaskColumns
                columns={columns}
                tasks={filteredTasks}
                viewMode={viewMode}
                moveTask={moveTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </DndProvider>
  );
}