'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { MultiBackend, createTransition } from 'react-dnd-multi-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { getSupabaseFrontendClient } from '@/lib/client';
import DashboardCards from '@/components/DashboardCards';
import TaskCharts from '@/components/TaskCharts';
import TaskFilters from '@/components/TaskFilters';
import TaskColumns from '@/components/TaskColumns';
import LogoutButton from '@/components/LogoutButton';
import { DragLayer } from '@/components/DragLayer';
import { Task, StatusCounts, PriorityCounts, DateRange } from '@/types/types';
import { fetchTasks, handleCreateTask, handleEditTask, handleDeleteTask, moveTask } from '@/types/taskUtils';

const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
    // @ts-expect-error unknown type-error
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

  useEffect(() => {
    fetchTasks(axiosAuth, supabase, router, setTasks, setIsLoading);
  }, [router, supabase, axiosAuth]);

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
              Authenticating ...
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
              className="text-gray-300 cursor-pointer data-[state=active]:text-[black] data-[state=inactive]:text-[#CAFE14] data-[state=active]:bg-[#CAFE14] data-[state=active]:border data-[state=active*:border-black"
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
              handleCreateTask={(e) => handleCreateTask(e, axiosAuth, setTasks, setIsDialogOpen)}
            />
            <div className="overflow-y-auto max-h-[70vh]" data-scroll-container="tasks-parent">
              <TaskColumns
                columns={columns}
                tasks={filteredTasks}
                viewMode={viewMode}
                moveTask={(taskId, newValue) => moveTask(taskId, newValue, tasks, viewMode, axiosAuth, setTasks)}
                onEdit={(task) => handleEditTask(task, axiosAuth, setTasks)}
                onDelete={(taskId) => handleDeleteTask(taskId, tasks, axiosAuth, setTasks)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </DndProvider>
  );
}