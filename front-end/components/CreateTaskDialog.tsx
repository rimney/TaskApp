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

function CreateTaskForm({ handleCreateTask }: CreateTaskFormProps) {
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true); // Set loading to true when submission starts
    try {
      await handleCreateTask(e); // Call the provided handleCreateTask
    } finally {
      setLoading(false); // Reset loading state after submission (success or failure)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="title">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              required
              disabled={loading} // Disable input during loading
              className="border-white bg-[#171818] text-gray-100 placeholder-gray-400 focus:ring-white focus:border-white"
            />
          </div>
          <div>
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="status">
              Status
            </Label>
            <Select name="status" defaultValue="In Progress" required disabled={loading}>
              <SelectTrigger className="border-white bg-[#171818] text-gray-100 focus:ring-white focus:border-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-[#171818] border-white text-gray-100">
                {['In Progress', 'In Review', 'On Hold', 'Completed'].map((status) => (
                  <SelectItem key={status} value={status} className="text-gray-100 hover:bg-[#2a2b2b]">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="priority">
              Priority
            </Label>
            <Select name="priority" defaultValue="Medium" required disabled={loading}>
              <SelectTrigger className="border-white bg-[#171818] text-gray-100 focus:ring-white focus:border-white">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-[#171818] border-white text-gray-100">
                {['High', 'Medium', 'Low'].map((priority) => (
                  <SelectItem key={priority} value={priority} className="text-gray-100 hover:bg-[#2a2b2b]">
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="category">
              Category
            </Label>
            <Select name="category" defaultValue="Development" required disabled={loading}>
              <SelectTrigger className="border-white bg-[#171818] text-gray-100 focus:ring-white focus:border-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-[#171818] border-white text-gray-100">
                {['Development', 'Testing', 'Bugs'].map((category) => (
                  <SelectItem key={category} value={category} className="text-gray-100 hover:bg-[#2a2b2b]">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-[140px]">
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="duedate">
              Due Date
            </Label>
            <Input
              id="duedate"
              name="duedate"
              type="date"
              required
              disabled={loading} // Disable input during loading
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
              required
              disabled={loading} // Disable textarea during loading
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
              required
              disabled={loading} // Disable textarea during loading
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
              placeholder="Enter each criterion on a new line"
              disabled={loading} // Disable textarea during loading
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
              disabled={loading} // Disable textarea during loading
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <Button
          type="submit"
          className="w-[110px] border border-black bg-[#CAFE14] cursor-pointer text-[#171818] shadow-[4px_5px_0px_0px_#ffffff] hover:bg-white hover:text-black hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)] transition-all duration-300"
          disabled={loading} // Disable button during loading
        >
          {loading ? 'Adding task...' : 'Create Task'}
        </Button>
      </div>
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
        <Button
          className="bg-[#CAFE1436] text-center text-black hover:bg-[#CAFE14] hover:text-[#171818] hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)] transition-all duration-300"
        >
          Create Task <BadgePlus />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-full h-[800px] overflow-y-auto rounded-t-[20px] p-4 bg-[#171818] border border-white shadow-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-[#CAFE14]">Create New Task</SheetTitle>
          <SheetDescription className="text-gray-300">
            Fill in the details to create a new task.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <CreateTaskForm handleCreateTask={handleCreateTask} />
        </div>
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-[#CAFE1436] text-[#CAFE14] border cursor-pointer border-white hover:bg-[#CAFE14] hover:text-[#171818] hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)] transition-all duration-300"
        >
          Create Task <BadgePlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[900px] sm:max-w-[700px] md:max-w-[900px] bg-[#171818] border border-white shadow-lg [&>button]:text-[#CAFE14] [&>button]:hover:text-white [&>button]:hover:bg-[#2a2b2b]">
        <DialogHeader>
          <DialogTitle className="text-[#CAFE14]">Create New Task</DialogTitle>
        </DialogHeader>
        <CreateTaskForm handleCreateTask={handleCreateTask} />
      </DialogContent>
    </Dialog>
  );
}