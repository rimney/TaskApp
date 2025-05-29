import { useDrop, DropTargetMonitor } from 'react-dnd';
import { TaskCard } from './TaskCard';
import { Task } from '@/types/tasks';
import React, { useRef } from 'react';
import { useDeviceMode } from '@/lib/hooks/useDeviceMode';
import { hexToRgba } from '@/lib/utils/colorUtils';

interface DragItem {
  id: number;
  status: string;
  priority: string;
  title: string;
  duedate: string;
  category: string;
  description: Task['description'];
}

interface ColumnProps {
  status: string;
  color: string;
  tasks: Task[];
  moveTask: (taskId: number, newValue: string) => void;
  onEdit: (task: Task) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isPriorityView?: boolean;
}

export function Column({ status, color, tasks, moveTask, onEdit, onDelete, isPriorityView }: ColumnProps) {
  const deviceMode = useDeviceMode();
  const divRef = useRef<HTMLDivElement>(null); // Create a ref for the div

  // Define valid transitions for status view
  const validTransitions: { [key: string]: string[] } = {
    'In Progress': ['In Review', 'Completed', 'On Hold'],
    'In Review': ['Completed', 'On Hold'],
    'On Hold': ['In Progress', 'In Review', 'Completed'],
    'Completed': ['In Progress', 'In Review'],
  };

  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: 'TASK',
    canDrop: (item: DragItem) => {
      if (isPriorityView) {
        // Allow all drops in priority view
        return true;
      }
      // In status view, check if the transition is valid
      const currentStatus = item.status.replace('_', ' ');
      const allowedStatuses = validTransitions[currentStatus] || [];
      return allowedStatuses.includes(status);
    },
    drop: (item: DragItem) => moveTask(item.id, status),
    collect: (monitor: DropTargetMonitor<DragItem, void>) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Combine the drop ref with the div ref
  const setRef = (node: HTMLDivElement | null) => {
    // @ts-expect-error react 18 : Cannot assign to 'current' because it is a read-only property.ts(2540)
    divRef.current = node;
    drop(node); // Connect the drop target
  };

  const priorityColors = {
    High: '#FEAFB2',
    Medium: '#F6BE55',
    Low: '#5CD767',
  };

  const statusColors = {
    In_Progress: '#9d9bfe',
    In_Review: '#ECA7FE',
    On_Hold: '#F6BC54',
    Completed: '#5DD66A',
  };

  const getBackgroundColor = () => {
    if (isOver && canDrop) {
      if (!tasks.length) return hexToRgba('#2a2b2b', 0.7);
      if (isPriorityView) {
        return hexToRgba(priorityColors[status as keyof typeof priorityColors] || '#2a2b2b', 0.2);
      } else {
        return hexToRgba(statusColors[status.replace(' ', '_') as keyof typeof statusColors] || '#2a2b2b', 0.2);
      }
    }
    return '#171818';
  };

  return (
    <div
      ref={setRef}
      className={`flex-1 ${deviceMode === 'mobile' ? 'min-w-[100%]' : 'min-w-[305px]'} min-h-${
        deviceMode === 'mobile' ? 'auto' : 'screen'
      } flex justify-start items-center overflow-x-hidden flex-col rounded shadow-lg overflow-y-auto`}
      style={{ backgroundColor: getBackgroundColor() }}
      data-column={status}
    >
      <h2 className="text-lg font-semibold mb-2 text-[#CAFE14]" style={{ color }}>
        {status} ({tasks.length})
      </h2>
      <div className="space-y-2 p-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            {...task}
            // @ts-expect-error unknown type error
            status={task.status.replace(' ', '_') as Task['status']}
            moveTask={moveTask}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}