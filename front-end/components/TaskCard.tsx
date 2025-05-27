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
import { toast } from 'react-toastify';
import React from 'react';

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

  const getStatusColor = (status: string) => statusColors[status as keyof typeof statusColors] || '#000000';
  const getCategoryColor = (category: string) => categoryColors[category as keyof typeof categoryColors] || '#000000';

  if (!categoryColors[category]) {
    console.warn(`Invalid category "${category}" for task ID ${id}. Using fallback color #000000.`);
  }
  if (!statusColors[status]) {
    console.warn(`Invalid status "${status}" for task ID ${id}. Using fallback color #000000.`);
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
    transform: isDragging ? 'scale(1.05)' : 'none',
    boxShadow: isDragging ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
    border: isDragging ? '2px solid blue' : '1px solid black',
    cursor: 'move',
    transition: 'transform 0.0s ease, box-shadow 0.0s ease',
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedTask: Task = {
      id,
      title: formData.get('title') as string,
      priority: formData.get('priority') as 'High' | 'Medium' | 'Low',
      duedate: formData.get('duedate') as string,
      // @ts-expect-error type

      status: formData.get('status') as 'In_Progress' | 'In_Review' | 'On_Hold' | 'Completed',
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
    } 
    
    catch (
      // @ts-expect-error type
      
      error: Error) {
      toast.error(error.message || 'Failed to edit task');
    }
  };

  return (
    <div
      // @ts-expect-error type

      ref={drag}
      style={style}
      className="w-full sm:w-[300px] rounded-[13px] h-[120px] border flex flex-col bg-white touch-none"
    >
      <div className="w-full h-[40px] flex flex-row">
        <div className="w-[80%] flex items-center">
          <Sheet>
            <SheetTrigger>
              <span
                className="font-semibold text-sm sm:text-[17px] cursor-pointer hover:underline ml-2 truncate"
                style={{
                  maxWidth: '200px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'inline-block',
                }}
              >
                {title}
              </span>
            </SheetTrigger>
            <SheetContent className="w-[90vw] sm:min-w-[400px] md:min-w-[600px]">
              <SheetHeader>
                <SheetTitle>{title}</SheetTitle>
                <SheetDescription>Detailed information about the task.</SheetDescription>
              </SheetHeader>
              <DescriptionRenderer
                task={{
                  id,
                  title,
                  priority,
                  duedate,
      // @ts-expect-error type

                  status,
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
              <Ellipsis className="mt-1 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Edit
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-[900px] sm:max-w-[700px] md:max-w-[900px]">
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="mb-2 text-sm sm:text-base" htmlFor="title">
                            Title
                          </Label>
                          <Input id="title" name="title" defaultValue={title} required />
                        </div>
                        <div>
                          <Label className="mb-2 text-sm sm:text-base" htmlFor="status">
                            Status
                          </Label>
                          <Select name="status" defaultValue={status} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {['In Progress', 'In Review', 'On Hold', 'Completed'].map((statusOption) => (
                                <SelectItem key={statusOption} value={statusOption}>
                                  {statusOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="mb-2 text-sm sm:text-base" htmlFor="priority">
                            Priority
                          </Label>
                          <Select name="priority" defaultValue={priority} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              {['High', 'Medium', 'Low'].map((priorityOption) => (
                                <SelectItem key={priorityOption} value={priorityOption}>
                                  {priorityOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="mb-2 text-sm sm:text-base" htmlFor="category">
                            Category
                          </Label>
                          <Select name="category" defaultValue={category} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {['Development', 'Testing', 'Bugs'].map((categoryOption) => (
                                <SelectItem key={categoryOption} value={categoryOption}>
                                  {categoryOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-full sm:w-[140px]">
                          <Label className="mb-2 text-sm sm:text-base" htmlFor="duedate">
                            Due Date
                          </Label>
                          <Input id="duedate" name="duedate" type="date" defaultValue={duedate} required />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label className="mb-2 text-sm sm:text-base" htmlFor="summary">
                            Summary
                          </Label>
                          <Textarea
                            className="max-h-[100px] sm:max-h-[120px] overflow-scroll"
                            id="summary"
                            name="summary"
                            defaultValue={description.summary}
                            required
                          />
                        </div>
                        <div>
                          <Label className="mb-2 text-sm sm:text-base" htmlFor="details">
                            Details
                          </Label>
                          <Textarea
                            className="max-h-[100px] sm:max-h-[120px] overflow-scroll"
                            id="details"
                            name="details"
                            defaultValue={description.details}
                            required
                          />
                        </div>
                        <div>
                          <Label className="mb-2 text-sm sm:text-base" htmlFor="acceptanceCriteria">
                            Acceptance Criteria (one per line)
                          </Label>
                          <Textarea
                            className="max-h-[100px] sm:max-h-[120px] overflow-scroll"
                            id="acceptanceCriteria"
                            name="acceptanceCriteria"
                            defaultValue={description.acceptanceCriteria.join('\n')}
                            placeholder="Enter each criterion on a new line"
                          />
                        </div>
                        <div>
                          <Label className="mb-2 text-sm sm:text-base" htmlFor="notes">
                            Notes
                          </Label>
                          <Textarea
                            className="max-h-[80px] overflow-scroll"
                            id="notes"
                            name="notes"
                            defaultValue={description.notes || ''}
                          />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" className="bg-[#9d9bfe] hover:bg-[#8c8afe] text-white w-full">
                      Save Changes
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <DropdownMenuItem onClick={() => onDelete(id)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="w-full  h-[40px] flex items-center gap-2 flex-wrap">
        <Badge
          className="h-[20px] sm:h-[25px] cursor-pointer ml-2 text-black text-xs sm:text-sm"
          style={{ backgroundColor: priorityColors[priority] || '#000000' }}
        >
          {priority}
        </Badge>
        <Badge
          className="h-[20px] sm:h-[25px] cursor-pointer text-black text-xs sm:text-sm"
          style={{ backgroundColor: getStatusColor(status) }}
        >
          {status.split('_')[0]} {status.split('_')[1]}
        </Badge>
        <Badge
          className="h-[20px] sm:h-[25px] cursor-pointer text-black text-xs sm:text-sm"
          style={{ backgroundColor: getCategoryColor(category) }}
        >
          {category}
        </Badge>
      </div>
      <div className="w-full h-[35px] flex gap-2 items-center">
        <Calendar className="ml-2 w-4 sm:w-5" />
        <span className="mt-[3px] font-semibold text-sm sm:text-base">{duedate}</span>
      </div>
    </div>
  );
}