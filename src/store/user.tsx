import { create } from 'zustand';

interface BackendUser {
    id: string;
    name?: string;
}

interface AuthState {
    userData: BackendUser | null;
    mail: string | null;
    loading: boolean;
    init: (token: string) => Promise<void>;
    reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    userData: null,
    mail: null,
    loading: true,

    init: async (token) => {
        set({ loading: true });

        try {
            const res = await fetch('https://api.youhold.online/auth/me', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            console.log('data: ', data)
            set({ userData: data.data, loading: false, mail: data.email });

        } catch (e) {
            console.error('auth/me failed', e);
            set({ userData: null, loading: false });
        }
    },

    reset: () => set({ userData: null, loading: false, mail: null }),
}));
