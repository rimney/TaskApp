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
import { useState } from 'react';
import React from 'react';
import { useDeviceMode } from '@/lib/hooks/useDeviceMode';
import { CreateTaskDialogProps, CreateTaskFormProps } from '@/types/types';



function CreateTaskForm({ handleCreateTask }: CreateTaskFormProps) {
  const [loading, setLoading] = useState(false);
  const deviceMode = useDeviceMode();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    try {
      await handleCreateTask(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`grid grid-cols-1 ${deviceMode === 'desktop' ? 'sm:grid-cols-2' : ''} gap-4 sm:gap-6`}>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="title">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              required
              disabled={loading}
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
          <div className={`w-full ${deviceMode === 'desktop' ? 'sm:w-[140px]' : ''}`}>
            <Label className="mb-2 text-sm sm:text-base text-[#CAFE14]" htmlFor="duedate">
              Due Date
            </Label>
            <Input
              id="duedate"
              name="duedate"
              type="date"
              required
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <Button
          type="submit"
          className="w-[120px] bg-[#CAFE14] border border-black cursor-pointer text-[#171818] shadow-[4px_5px_0px_0px_#ffffff] hover:bg-white hover:text-black hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)] transition-all duration-300"
          disabled={loading}
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
  const deviceMode = useDeviceMode();

  return deviceMode === 'mobile' ? (
    <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <SheetTrigger asChild>
        <Button
          className={`bg-[#CAFE1436] text-center ${deviceMode === 'mobile' ? 'bg-[#CAFE14]' : ''} text-black hover:bg-[#CAFE14] hover:text-[#171818] hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)] transition-all duration-300`}
        >
          Create Task <BadgePlus />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-[100vw] h-[80vh] bg-[#171818] border-t border-white shadow-lg rounded-t-[20px] p-4 focus:ring-0 [&>button]:text-[#CAFE14] [&>button]:hover:text-white [&>button]:hover:bg-[#2a2b2b]"
      >
        <SheetHeader>
          <SheetTitle className="text-[#CAFE14]">Create New Task</SheetTitle>
          <SheetDescription className="text-gray-300">
            Fill in the details to create a new task.
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto mt-4">
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
      <DialogContent className={`w-[95vw] max-w-[900px] ${deviceMode === 'desktop' ? 'sm:max-w-[700px] md:max-w-[900px]' : ''} bg-[#171818] border border-white shadow-lg [&>button]:text-[#CAFE14] [&>button]:hover:text-white [&>button]:hover:bg-[#2a2b2b]`}>
        <DialogHeader>
          <DialogTitle className="text-[#CAFE14]">Create New Task</DialogTitle>
        </DialogHeader>
        <CreateTaskForm handleCreateTask={handleCreateTask} />
      </DialogContent>
    </Dialog>
  );
}