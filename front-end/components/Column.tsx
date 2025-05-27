'use client';

import { useDrop } from 'react-dnd';
import { TaskCard } from './TaskCard';
import { Task } from '@/types/tasks';
import React from 'react';

interface ColumnProps {
  status: string;
  color: string;
  tasks: Task[];
  moveTask: (taskId: number, newValue: string) => void;
  // isPriorityView: boolean;
  onEdit: (task: Task) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function Column({ status, color, tasks, moveTask,  onEdit, onDelete }: ColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      // @ts-expect-error type

      ref={drop}
      className={`sm:flex-1 w-full h-full sm:h-screen rounded ${isOver ? 'bg-gray-100' : ''} overflow-y-auto`}
      style={{ minWidth: '300px' }}
      data-column={status}
    >
      <h2 className="text-lg font-semibold mb-2" style={{ color }}>
        {status} ({tasks.length})
      </h2>
      <div className="space-y-2">
        {tasks.map((task) => (
      // @ts-expect-error type
          
          <TaskCard
            key={task.id}
            {...task}
            moveTask={moveTask}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}