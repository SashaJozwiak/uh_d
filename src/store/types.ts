// types/navTypes.ts
export type SidebarType = 'account' | 'presale' | 'airdrop' | 'achivs' | 'ambassadors';

export interface UseNav {
    sidebar: SidebarType;
    isMobile: boolean;
    isSidebarOpen: boolean;
    setSidebar: (nav: SidebarType) => void;
    setIsMobile: (isMobile: boolean) => void;
    setSidebarOpen: (isSidebarOpen: boolean) => void;
}
