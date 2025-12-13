import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date | string; // Keeping it string for easier serialization initially, or Date if we handle it
  time?: string;
  isCompleted: boolean;
  repeat?: "Daily" | "Weekly" | "Monthly" | "No repeat";
  reminder?: boolean;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "isCompleted">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearAll: () => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      tasks: [],
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Math.random().toString(36).substr(2, 9),
              isCompleted: false,
            },
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      clearAll: () => set({ tasks: [] }),
      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
