import { DragState } from '@/types/types';
import { create } from 'zustand';


export const useDragStore = create<DragState>((set) => ({
  isDragging: false,
  draggedTaskId: null,
  setDragging: (isDragging, taskId = null) => set({ isDragging, draggedTaskId: isDragging ? taskId : null }),
}));