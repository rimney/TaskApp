'use client';

import { useDrag } from 'react-dnd';
import { Badge } from '../components/ui/badge';
import { Calendar, Ellipsis } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '../components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { DescriptionRenderer } from './DescriptionRenderer';
import { useState } from 'react';
import { Task } from '../types/tasks';
import { toast } from 'sonner';
import React from 'react';
import { useDeviceMode } from '@/lib/hooks/useDeviceMode';

interface TaskCardProps {
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

export function TaskCard({
  title,
  priority,
  duedate,
  status,
  category,
  id,
  isDragging = false,
  description,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deviceMode = useDeviceMode();

  const statusColors = {
    'In_Progress': '#9d9bfe',
    'In_Review': '#ECA7FE',
    'On_Hold': '#F6BC54',
    Completed: '#5DD66A',
  };

  const categoryColors = {
    Development: '#38BDF8',
    Testing: '#2DD4BF',
    Bugs: '#EF4444',
  };

  const priorityColors = {
    High: '#FEAFB2',
    Medium: '#F6BE55',
    Low: '#5CD767',
  };

  const getStatusColor = (status: string) => statusColors[status as keyof typeof statusColors] || '#FFFFFF';
  const getCategoryColor = (category: string) => categoryColors[category as keyof typeof categoryColors] || '#FFFFFF';

  if (!categoryColors[category]) {
    console.warn(`Invalid category "${category}" for task ID ${id}. Using fallback color #FFFFFF.`);
  }
  if (!statusColors[status]) {
    console.warn(`Invalid status "${status}" for task ID ${id}. Using fallback color #FFFFFF.`);
  }

  const [{ isDragging: isTaskDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id, status, title, priority, duedate, category, description },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const style = {
    opacity: isTaskDragging ? 0 : 1,
    transform: isDragging || isTaskDragging ? 'scale(1.05)' : 'none',
    boxShadow: isDragging || isTaskDragging ? '0 4px 12px rgba(255, 255, 255, 0.3)' : 'none',
    border: isDragging || isTaskDragging ? '2px solid #CAFE14' : '1px solid white',
    cursor: 'move',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const updatedTask: Task = {
    id,
    title: formData.get('title') as string,
    priority: formData.get('priority') as 'High' | 'Medium' | 'Low',
    duedate: formData.get('duedate') as string,
            // @ts-expect-error unknown type error

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
  try {
    await onEdit(updatedTask);
    setIsEditDialogOpen(false);
  } catch (error: unknown) { // Changed from Error to unknown
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(errorMessage || 'Failed to edit task');
  }
};

const handleDeleteConfirm = async () => {
  try {
    await onDelete(id);
    setIsDeleteDialogOpen(false);
    toast.success('Task deleted successfully');
  } 
  catch (error: unknown) { // Changed from Error to unknown
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(errorMessage || 'Failed to delete task');
  }
};

  const EditForm = () => (
    <form onSubmit={handleEditSubmit} className="space-y-4">
      <div className={`grid grid-cols-1 ${deviceMode === 'desktop' ? 'sm:grid-cols-2' : ''} gap-4 sm:gap-6`}>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="title">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={title}
              required
              className="border-white bg-[#171818] text-gray-100 placeholder-gray-400 focus:ring-white focus:border-white"
            />
          </div>
          <div>
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="status">
              Status
            </Label>
            <Select name="status" defaultValue={status.replace('_', ' ')} required>
              <SelectTrigger className="border-white bg-[#171818] text-gray-100 focus:ring-white focus:border-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-[#171818] border-white text-gray-100">
                {['In Progress', 'In Review', 'On Hold', 'Completed'].map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption} className="text-gray-100 hover:bg-[#2a2b2b]">
                    {statusOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="priority">
              Priority
            </Label>
            <Select name="priority" defaultValue={priority} required>
              <SelectTrigger className="border-white bg-[#171818] text-gray-100 focus:ring-white focus:border-white">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-[#171818] border-white text-gray-100">
                {['High', 'Medium', 'Low'].map((priorityOption) => (
                  <SelectItem key={priorityOption} value={priorityOption} className="text-gray-100 hover:bg-[#2a2b2b]">
                    {priorityOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="category">
              Category
            </Label>
            <Select name="category" defaultValue={category} required>
              <SelectTrigger className="border-white bg-[#171818] text-gray-100 focus:ring-white focus:border-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-[#171818] border-white text-gray-100">
                {['Development', 'Testing', 'Bugs'].map((categoryOption) => (
                  <SelectItem key={categoryOption} value={categoryOption} className="text-gray-100 hover:bg-[#2a2b2b]">
                    {categoryOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className={`w-full ${deviceMode === 'desktop' ? 'sm:w-[140px]' : ''}`}>
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="duedate">
              Due Date
            </Label>
            <Input
              id="duedate"
              name="duedate"
              type="date"
              defaultValue={duedate}
              required
              className="border-white bg-[#171818] text-gray-100 placeholder-gray-400 focus:ring-white focus:border-white"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="summary">
              Summary
            </Label>
            <Textarea
              className="max-h-[100px] sm:max-h-[120px] overflow-scroll border-white bg-[#171818] text-gray-100 placeholder-gray-400 focus:ring-white focus:border-white"
              id="summary"
              name="summary"
              defaultValue={description.summary}
              required
            />
          </div>
          <div>
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="details">
              Details
            </Label>
            <Textarea
              className="max-h-[100px] sm:max-h-[120px] overflow-scroll border-white bg-[#171818] text-gray-100 placeholder-gray-400 focus:ring-white focus:border-white"
              id="details"
              name="details"
              defaultValue={description.details}
              required
            />
          </div>
          <div>
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="acceptanceCriteria">
              Acceptance Criteria (one per line)
            </Label>
            <Textarea
              className="max-h-[100px] sm:max-h-[120px] overflow-scroll border-white bg-[#171818] text-gray-100 placeholder-gray-400 focus:ring-white focus:border-white"
              id="acceptanceCriteria"
              name="acceptanceCriteria"
              defaultValue={description.acceptanceCriteria.join('\n')}
              placeholder="Enter each criterion on a new line"
            />
          </div>
          <div>
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="notes">
              Notes
            </Label>
            <Textarea
              className="max-h-[80px] overflow-scroll border-white bg-[#171818] text-gray-100 placeholder-gray-400 focus:ring-white focus:border-white"
              id="notes"
              name="notes"
              defaultValue={description.notes || ''}
            />
          </div>
        </div>
      </div>
      <div className='w-full flex justify-center'>
        <Button
          type="submit"
          className="w-[120px] bg-[#CAFE14] border border-black cursor-pointer text-[#171818] shadow-[4px_5px_0px_0px_#ffffff] hover:bg-white hover:text-black hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)] transition-all duration-300"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );

  const DeleteConfirm = () => (
    <div className="space-y-4">
      <p className="text-gray-300 text-sm sm:text-base">
        Are you sure you want to delete the task <span className="text-[#CAFE14]">{title}</span>? This action cannot be undone.
      </p>
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => setIsDeleteDialogOpen(false)}
          className="w-[70px] bg-white border border-black cursor-pointer text-[#171818] shadow-[4px_5px_0px_0px_#CAFE14] hover:bg-[#CAFE14] hover:text-black hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)] transition-all duration-300"
        >
          Cancel
        </Button>
        <Button
          onClick={handleDeleteConfirm}
          className="w-[70px] bg-[#CAFE14] text-black border border-black shadow-[4px_5px_0px_0px_#ffffff] hover:bg-[white] hover:text-black hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)] cursor-pointer transition-all duration-300"
        >
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <div
            // @ts-expect-error unknown type error

      ref={drag}
      style={style}
      className={`w-full ${deviceMode === 'desktop' ? 'min-w-[306px]' : 'min-w-[330px]'} rounded-[13px] h-[${deviceMode === 'mobile' ? '120px' : '130px'}] border flex flex-col bg-[#171818] touch-none shadow-lg`}
    >
      <div className="w-full h-[40px] flex flex-row">
        <div className="w-[80%] flex items-center">
          <Sheet>
            <SheetTrigger>
              <span
                className={`font-semibold text-sm ${deviceMode === 'desktop' ? 'sm:text-[17px] ' : ''} cursor-pointer hover:underline ml-2 truncate text-[#CAFE14]`}
                style={{
                  maxWidth: deviceMode === 'mobile' ? '150px' : '200px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'inline-block',
                }}
              >
                {title}
              </span>
            </SheetTrigger>
            <SheetContent className={`w-[90vw] ${deviceMode === 'desktop' ? 'sm:min-w-[400px]  border-none md:min-w-[600px]' : ''} bg-[#171818] border border-white shadow-lg [&>button]:text-[#CAFE14] [&>button]:hover:text-white [&>button]:hover:bg-[#2a2b2b]`}>
              <SheetHeader>
                <SheetTitle className="text-[#CAFE14]">{title}</SheetTitle>
                <SheetDescription className="text-gray-300">Detailed information about the task.</SheetDescription>
              </SheetHeader>
              <DescriptionRenderer
                task={{
                  id,
                  title,
                  priority,
                  duedate,
            // @ts-expect-error unknown type error

                  status: status.replace('_', ' '),
                  category,
                  description,
                }}
              />
            </SheetContent>
          </Sheet>
        </div>
        <div className="w-[20%] flex items-center justify-center h-full">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis className="mt-1 cursor-pointer text-gray-300 hover:text-[#CAFE14]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#171818] border border-white text-gray-100">
              {deviceMode === 'mobile' ? (
                <>
                  <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <SheetTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-gray-100 hover:bg-[#2a2b2b]">
                        Edit
                      </DropdownMenuItem>
                    </SheetTrigger>
                    <SheetContent
                      side="bottom"
                      className="w-[100vw] h-[80vh] bg-[#171818] border-t border-white shadow-lg rounded-t-[20px] p-4 focus:ring-0 [&>button]:text-[#CAFE14] [&>button]:hover:text-white [&>button]:hover:bg-[#2a2b2b]"
                    >
                      <SheetHeader>
                        <SheetTitle className="text-[#CAFE14]">Edit Task</SheetTitle>
                        <SheetDescription className="text-gray-300">Modify the task details below.</SheetDescription>
                      </SheetHeader>
                      <div className="overflow-y-auto mt-4">
                        <EditForm />
                      </div>
                    </SheetContent>
                  </Sheet>
                  <Sheet open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <SheetTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-300 hover:bg-[#2a2b2b]">
                        Delete
                      </DropdownMenuItem>
                    </SheetTrigger>
                    <SheetContent
                      side="bottom"
                      className="w-[100vw] h-[30vh] bg-[#171818] border-t border-white shadow-lg rounded-t-[20px] p-4 focus:ring-0 [&>button]:text-[#CAFE14] [&>button]:hover:text-white [&>button]:hover:bg-[#2a2b2b]"
                    >
                      <SheetHeader>
                        <SheetTitle className="text-[#CAFE14]">Delete Task</SheetTitle>
                        <SheetDescription className="text-gray-300">Confirm deletion of the task.</SheetDescription>
                      </SheetHeader>
                      <div className="mt-4">
                        <DeleteConfirm />
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              ) : (
                <>
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-gray-100 hover:bg-[#2a2b2b]">
                        Edit
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className={`w-[95vw] max-w-[900px] ${deviceMode === 'desktop' ? 'sm:max-w-[700px] md:max-w-[900px]' : ''} bg-[#171818] border border-white shadow-lg [&>button]:text-[#CAFE14] [&>button]:hover:text-white [&>button]:hover:bg-[#2a2b2b]`}>
                      <DialogHeader>
                        <DialogTitle className="text-[#CAFE14]">Edit Task</DialogTitle>
                      </DialogHeader>
                      <EditForm />
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-300 hover:bg-[#2a2b2b]">
                        Delete
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-[500px] bg-[#171818] border border-white shadow-lg [&>button]:text-[#CAFE14] [&>button]:hover:text-white [&>button]:hover:bg-[#2a2b2b]">
                      <DialogHeader>
                        <DialogTitle className="text-[#CAFE14]">Delete Task</DialogTitle>
                      </DialogHeader>
                      <DeleteConfirm />
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="w-full h-[40px] ml-2 flex items-center gap-2 flex-wrap">
        <Badge
          className={`h-[20px] ${deviceMode === 'desktop' ? 'sm:h-[25px]' : ''} cursor-pointer text-black text-xs sm:text-sm`}
          style={{ backgroundColor: priorityColors[priority] || '#FFFFFF' }}
        >
          {priority}
        </Badge>
        <Badge
          className={`h-[20px] ${deviceMode === 'desktop' ? 'sm:h-[25px]' : ''} cursor-pointer text-black text-xs sm:text-sm`}
          style={{ backgroundColor: getStatusColor(status) }}
        >
          {status.replace('_', ' ')}
        </Badge>
        <Badge
          className={`h-[20px] ${deviceMode === 'desktop' ? 'sm:h-[25px]' : ''} cursor-pointer text-black text-xs sm:text-sm`}
          style={{ backgroundColor: getCategoryColor(category) }}
        >
          {category}
        </Badge>
      </div>
      <div className="w-full h-[35px] flex gap-2 items-center">
        <Calendar className={`ml-2 w-4 ${deviceMode === 'desktop' ? 'sm:w-5' : ''} text-[#CAFE14]`} />
        <span className={`mt-[3px] font-semibold text-sm ${deviceMode === 'desktop' ? 'sm:text-base' : ''} text-gray-300`}>{duedate}</span>
      </div>
    </div>
  );
}