import { CardContent, CardFooter } from '@/components/ui/card';
import { Column } from '@/components/Column';

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
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskColumns({ columns, tasks, viewMode, moveTask, onEdit, onDelete }: TaskColumnsProps) {
  return (
    <>
      <CardContent>
        <div
          className="w-full h-auto flex flex-col sm:flex-row overflow-x-auto gap-4 p-4"
          data-scroll-container="tasks"
        >
          {columns.map((column) => (
            <Column
              key={column.label}
              status={column.label}
              color={column.color}
      // @ts-expect-error type

              tasks={tasks.filter((task) =>
                viewMode === 'status'
                  ? task.status === column.label.replace(' ', '_')
                  : task.priority === column.label
              )}
              moveTask={moveTask}
              isPriorityView={viewMode === 'priority'}
      // @ts-expect-error type

              onEdit={onEdit}
      // @ts-expect-error type

              onDelete={onDelete}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </>
  );
}