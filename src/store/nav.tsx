import { create } from 'zustand';
import type { UseNav } from './types';

export const useNav = create<UseNav>((set) => ({
    sidebar: 'account',
    isMobile: window.innerWidth <= 768,
    isSidebarOpen: false,


    setSidebar: (nav) => set({ sidebar: nav }),
    setIsMobile: (isMobile) => set({ isMobile }),
    setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen })
}));
