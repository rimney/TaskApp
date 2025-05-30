import { toast } from 'sonner';
import { Task } from './types';
import { AxiosInstance } from 'axios';

export const fetchTasks = async (
  axiosAuth: AxiosInstance,
  supabase: any,
  router: any,
  setTasks: (tasks: Task[]) => void,
  setIsLoading: (loading: boolean) => void
) => {
  try {
    const { data } = await supabase.auth.getSession();
    console.log('Session:', data);

    if (!data.session) {
      router.push('/login');
      return;
    }

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
    console.error('Fetch tasks error:', errorMessage);
    toast.error(errorMessage || 'Failed to fetch tasks');
    router.push('/login');
  } finally {
    setIsLoading(false);
  }
};

export const handleCreateTask = async (
  e: React.FormEvent<HTMLFormElement>,
  axiosAuth: AxiosInstance,
  setTasks: (tasks: (prev: Task[]) => Task[]) => void,
  setIsDialogOpen: (open: boolean) => void
) => {
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Create task error:', errorMessage);
    toast.error(errorMessage || 'Failed to create task');
  }
};

export const handleEditTask = async (
  updatedTask: Task,
  axiosAuth: AxiosInstance,
  setTasks: (tasks: (prev: Task[]) => Task[]) => void
) => {
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Edit task error:', errorMessage);
    toast.error(errorMessage || 'Failed to update task');
  }
};

export const handleDeleteTask = async (
  taskId: number,
  tasks: Task[],
  axiosAuth: AxiosInstance,
  setTasks: (tasks: (prev: Task[]) => Task[]) => void
) => {
  try {
    const task = tasks.find((t) => t.id === taskId);
    await axiosAuth.delete(`/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    toast.success(`Task "${task?.title || taskId}" deleted successfully!`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Delete task error:', errorMessage);
    toast.error(errorMessage || 'Failed to delete task');
  }
};

export const moveTask = async (
  taskId: number,
  newValue: string,
  tasks: Task[],
  viewMode: 'status' | 'priority',
  axiosAuth: AxiosInstance,
  setTasks: (tasks: (prev: Task[]) => Task[]) => void
) => {
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

  // Optimistic update
  const previousTasks = [...tasks];
  const updatedTask: Task = {
    ...taskToUpdate,
    ...(viewMode === 'status'
      ? { status: newValue.replace(' ', '_') as Task['status'] }
      : { priority: newValue as Task['priority'] }),
  };
  setTasks((prev) =>
    prev.map((t) => (t.id === taskId ? updatedTask : t))
  );

  try {
    const payload = {
      ...updatedTask,
      status: updatedTask.status.replace(' ', '_') as Task['status'],
    };
    await axiosAuth.patch(`/tasks/${taskId}`, payload);
    const newValueDisplay = viewMode === 'status' ? newValue : newValue;
    toast.success(`Task "${taskToUpdate.title}" moved to ${newValueDisplay}`);
  } catch (error: unknown) {
    // Rollback on error
    setTasks(previousTasks);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Move task error:', errorMessage);
    toast.error(errorMessage || 'Failed to move task');
  }
};