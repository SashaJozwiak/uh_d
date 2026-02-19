import { create } from 'zustand';

export type SocialLink = {
    type: 'twitter' | 'telegram' | 'youtube' | 'other';
    link: string;
};

type AmbState = {
    links: SocialLink[];  // массив объектов { type, link }
    points: number;
    isLoading: boolean;
    getAll: (token: string) => Promise<void>;
    saveLinks: (token: string, linksToSave: SocialLink[]) => Promise<void>;
};

export const useAmb = create<AmbState>((set) => ({
    links: [],
    points: 0,
    isLoading: true,

    // Получаем данные амбассадора
    getAll: async (token: string) => {
        set({
            isLoading: true,
        });
        if (!token) return;
        try {
            const res = await fetch('https://api.youhold.online/amb/me', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error('Failed to fetch ambassador data');

            const data = await res.json();

            set({
                links: data.social_links || [],
                points: data.points || 0,
            });
        } catch (err) {
            console.error('useAmb getAll error:', err);
        } finally {
            set({
                isLoading: false,
            });
        }
    },

    // Сохраняем ссылки
    saveLinks: async (token: string, linksToSave: SocialLink[]) => {
        if (!token || !linksToSave?.length) return;

        set({
            isLoading: true,
        });

        try {
            const res = await fetch('https://api.youhold.online/amb/saveLink', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ links: linksToSave }),
            });

            if (!res.ok) throw new Error('Failed to save links');

            // Обновляем Zustand
            set({ links: linksToSave });
        } catch (err) {
            console.error('useAmb saveLinks error:', err);
        } finally {
            set({
                isLoading: false,
            });
        }
    },
}));
