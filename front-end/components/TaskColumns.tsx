'use client';

import { CardContent, CardFooter } from '@/components/ui/card';
import { Column } from '@/components/Column';
import { useDeviceMode } from '@/lib/hooks/useDeviceMode'; // Adjust path as needed
import React from 'react';
import { TaskColumnsProps } from '@/types/types';






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