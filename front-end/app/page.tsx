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
// import { getSupabaseFrontendClient } from '@/lib/client';
import DashboardCards from '@/components/DashboardCards';
import TaskCharts from '@/components/TaskCharts';
import TaskFilters from '@/components/TaskFilters';
import TaskColumns from '@/components/TaskColumns';
import LogoutButton from '@/components/LogoutButton';    
import { DragLayer } from '@/components/DragLayer';
import React from 'react';

// Define the transition to switch between HTML5 and Touch backends
const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      // @ts-expect-error type
      transition: createTransition('mousedown', (event) => !!event.buttons),
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

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'status' | 'priority'>('status');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  // const supabase = getSupabaseFrontendClient();
  const axiosAuth = useAxiosAuth();

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axiosAuth.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/tasks`);
      setTasks(response.data);
      console.log('Tasks fetched:', response.data);
      toast.success('Tasks fetched successfully!');
    }
    // @ts-expect-error type

    catch (error: Error) {
      console.error('Fetch tasks error:', error.response?.data, error.message);
      toast.error(error.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        await fetchTasks();
      }
    // @ts-expect-error type

      catch (error : Error) 
      {
        console.error('Session check error:', error);
        router.push('/login');
      }
    };
    checkSession();
  }, []);

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTask: Omit<Task, 'id'> = {
      title: formData.get('title') as string,
      priority: formData.get('priority') as 'High' | 'Medium' | 'Low',
      duedate: formData.get('duedate') as string,
      status: (formData.get('status') as string).replace(' ', '_') as 'In_Progress' | 'In_Review' | 'On_Hold' | 'Completed',
      category: formData.get('category') as 'Development' | 'Testing' | 'Bugs',
      description: {
        summary: formData.get('summary') as string,
        details: formData.get('details') as string,
        acceptanceCriteria: ((formData.get('acceptanceCriteria') as string) || '')
          .split('\n')
          .filter((item) => item.trim() !== ''),
        notes: (formData.get('notes') as string) || '',
      },
    };
    console.log('New task payload:', JSON.stringify(newTask, null, 2));
    try {

      const response = await axiosAuth.post<Task>(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/tasks`, newTask);
      setTasks((prev) => [...prev, response.data]);
      setIsDialogOpen(false);
      toast.success(`Task "${newTask.title}" created successfully!`);
    }
          // @ts-expect-error type

    catch (error : Error) {
      console.error('Create task error:', error.response?.data, error.message);
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleEditTask = async (updatedTask: Task) => {
    try {
      const payload = {
        ...updatedTask,
        status: updatedTask.status.replace(' ', '_') as 'In_Progress' | 'In_Review' | 'On_Hold' | 'Completed',
      };
      const response = await axiosAuth.patch<Task>(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/tasks/${updatedTask.id}`, payload);
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? response.data : t))
      );
      toast.success(`Task "${updatedTask.title}" updated successfully!`);
    }
    catch 
          // @ts-expect-error type
          (error: Error) {
      console.error('Edit task error:', error.response?.data, error.message);
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      await axiosAuth.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      toast.success(`Task "${task?.title || taskId}" deleted successfully!`);
    }
          // @ts-expect-error type
    catch (error: Error) {
      console.error('Delete task error:', error.response?.data, error.message);
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const moveTask = async (taskId: number, newValue: string) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (!taskToUpdate) {
      toast.error('Task not found');
      return;
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
      await axiosAuth.patch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/tasks/${taskId}`, payload);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
      const newValueDisplay = viewMode === 'status' ? newValue : newValue;
      toast.success(`Task "${taskToUpdate.title}" moved to ${newValueDisplay}`);
    }
    catch 
          // @ts-expect-error type
    
    (error: Error) {
      console.error('Move task error:', error.response?.data, error.message);
      toast.error(error.response?.data?.message || 'Failed to move task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesPriority =
      viewMode === 'status' ? selectedPriority === 'All' || task.priority === selectedPriority : true;
    const matchesStatus =
      viewMode === 'priority' ? selectedStatus === 'All' || task.status.replace('_', ' ') === selectedStatus : true;
    return matchesCategory && matchesPriority && matchesStatus;
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
    return <div>Loading tasks...</div>;
  }

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <Toaster position="bottom-right" richColors />
      <DragLayer />
      <div className="w-full h-full bg-[#FFFFFF] flex items-center justify-center px-4 sm:px-6">
        <Tabs defaultValue="dashboard" className="w-full max-w-[1400px] mt-6 sm:mt-10">
          <LogoutButton />
          <TabsList className="grid w-full rounded-[13px] grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <DashboardCards statusCounts={statusCounts} />
            <TaskCharts tasks={tasks} />
          </TabsContent>
          <TabsContent value="tasks">
            <TaskFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedPriority={selectedPriority}
              setSelectedPriority={setSelectedPriority}
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
    </DndProvider>
  );
}