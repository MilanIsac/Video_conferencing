import { create } from 'zustand';

export const useTheme = create((set) => ({
    theme: localStorage.getItem('streamify-theme') || 'forest',
    setTheme: (theme) => {
        localStorage.setItem('streamify-theme', theme);
        set({ theme })
    },
}));