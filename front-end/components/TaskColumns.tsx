'use client';

import { CardContent, CardFooter } from '@/components/ui/card';
import { Column } from '@/components/Column';
import { useDeviceMode } from '@/lib/hooks/useDeviceMode'; // Adjust path as needed
import React from 'react';

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

interface ColumnType {
  label: string;
  color: string;
}

interface TaskColumnsProps {
  columns: ColumnType[];
  tasks: Task[];
  viewMode: 'status' | 'priority';
  moveTask: (taskId: number, newValue: string) => void;
  onEdit: (task: Task) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

export default function TaskColumns({ columns, tasks, viewMode, moveTask, onEdit, onDelete }: TaskColumnsProps) {
  const deviceMode = useDeviceMode();

  return (
    <>
      <CardContent className={`min-h-screen bg-[#171818] p-${deviceMode === 'mobile' ? '2' : '4'}`}>
        <div
          className={`w-full h-${deviceMode === 'mobile' ? 'auto' : '[calc(100vh-200px)]'} flex ${
            deviceMode === 'mobile' ? 'flex-col' : 'flex-row'
          } overflow-x-auto gap-${deviceMode === 'mobile' ? '2' : '4'} p-${deviceMode === 'mobile' ? '2' : '4'}`}
          data-scroll-container="tasks"
        >
          {columns.map((column) => (
            <Column
              key={column.label}
              status={column.label}
              color={column.color}
            // @ts-expect-error unknown type error

              tasks={tasks.filter((task) =>
                viewMode === 'status'
                  ? task.status === column.label.replace(' ', '_')
                  : task.priority === column.label
              )}
              moveTask={moveTask}
              isPriorityView={viewMode === 'priority'}
            // @ts-expect-error unknown type error

              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-[#171818]"></CardFooter>
    </>
  );
}