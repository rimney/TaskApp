import { create } from 'zustand';

interface DragState {
  isDragging: boolean;
  draggedTaskId: number | null;
  setDragging: (isDragging: boolean, taskId?: number | null) => void;
}

export const useDragStore = create<DragState>((set) => ({
  isDragging: false,
  draggedTaskId: null,
  setDragging: (isDragging, taskId = null) => set({ isDragging, draggedTaskId: isDragging ? taskId : null }),
}));