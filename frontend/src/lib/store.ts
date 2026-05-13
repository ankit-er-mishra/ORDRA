import { create } from 'zustand';

interface AppState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  darkMode: typeof window !== 'undefined'
    ? localStorage.getItem('ordra-dark-mode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    : false,
  toggleDarkMode: () =>
    set((state) => {
      const newValue = !state.darkMode;
      localStorage.setItem('ordra-dark-mode', String(newValue));
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { darkMode: newValue };
    }),
  setDarkMode: (value: boolean) =>
    set(() => {
      localStorage.setItem('ordra-dark-mode', String(value));
      if (value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { darkMode: value };
    }),
}));
