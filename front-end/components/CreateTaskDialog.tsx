'use client';

import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '../components/ui/sheet';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { BadgePlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import React from 'react';

// Custom hook to detect mobile screen size
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

interface CreateTaskDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  handleCreateTask: (e: React.FormEvent<HTMLFormElement>) => void;
}

interface CreateTaskFormProps {
  handleCreateTask: (e: React.FormEvent<HTMLFormElement>) => void;
}

// Reusable form component for both Dialog and Sheet
function CreateTaskForm({ handleCreateTask }: CreateTaskFormProps) {
  return (
    <form onSubmit={handleCreateTask} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 text-sm sm:text-base" htmlFor="title">
              Title
            </Label>
            <Input id="title" name="title" required />
          </div>
          <div>
            <Label className="mb-2 text-sm sm:text-base" htmlFor="status">
              Status
            </Label>
            <Select name="status" defaultValue="In Progress" required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {['In Progress', 'In Review', 'On Hold', 'Completed'].map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 text-sm sm:text-base" htmlFor="priority">
              Priority
            </Label>
            <Select name="priority" defaultValue="Medium" required>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {['High', 'Medium', 'Low'].map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 text-sm sm:text-base" htmlFor="category">
              Category
            </Label>
            <Select name="category" defaultValue="Development" required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {['Development', 'Testing', 'Bugs'].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-[140px]">
            <Label className="mb-2 text-sm sm:text-base" htmlFor="duedate">
              Due Date
            </Label>
            <Input id="duedate" name="duedate" type="date" required />
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
            />
          </div>
        </div>
      </div>
      <Button
        type="submit"
        className="bg-[#9d9bfe] hover:bg-[#8c8afe] text-white w-full"
      >
        Create Task
      </Button>
    </form>
  );
}

export default function CreateTaskDialog({
  isDialogOpen,
  setIsDialogOpen,
  handleCreateTask,
}: CreateTaskDialogProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');

  return isMobile ? (
    <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          Create Task <BadgePlus />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-full h-[80vh] overflow-y-auto rounded-t-[20px] p-4"
      >
        <SheetHeader>
          <SheetTitle>Create New Task</SheetTitle>
          <SheetDescription>Fill in the details to create a new task.</SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <CreateTaskForm handleCreateTask={handleCreateTask} />
        </div>
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Create Task <BadgePlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[900px] sm:max-w-[700px] md:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <CreateTaskForm handleCreateTask={handleCreateTask} />
      </DialogContent>
    </Dialog>
  );
}