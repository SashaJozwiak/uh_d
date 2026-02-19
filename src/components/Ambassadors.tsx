import { useEffect, useState, type JSX } from 'react';
import { useAmb, type SocialLink } from '../store/amb';
import { useAuth } from 'react-oidc-context';

type Social = {
    id: SocialLink['type'];
    name: string;
    icon: JSX.Element;
    placeholder: string;
};

const SOCIALS: Social[] = [
    {
        id: 'twitter',
        name: 'Twitter / X',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    fill="currentColor"
                />
            </svg>
        ),
        placeholder: 'https://x.com/username',
    },
    {
        id: 'telegram',
        name: 'Telegram',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 2L2.5 10.8c-1 .4-.9 1.8.1 2.1l4.8 1.5 1.8 5.5c.3.9 1.4 1.1 2 .4l2.9-3.3 4.9 3.6c.8.6 1.9.2 2.1-.8L24 3.6C24 2.4 22.9 1.6 22 2z" />
            </svg>
        ),
        placeholder: 'https://t.me/username',
    },
    {
        id: 'youtube',
        name: 'YouTube',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a2.995 2.995 0 0 0-2.116-2.116C19.511 3.5 12 3.5 12 3.5s-7.511 0-9.382.57a2.995 2.995 0 0 0-2.116 2.116C0 8.056 0 12 0 12s0 3.944.502 5.814a2.995 2.995 0 0 0 2.116 2.116C4.489 20.5 12 20.5 12 20.5s7.511 0 9.382-.57a2.995 2.995 0 0 0 2.116-2.116C24 15.944 24 12 24 12s0-3.944-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
        placeholder: 'https://youtube.com/@channel',
    },
    {
        id: 'other',
        name: 'Other social',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path
                    d="M9.75 9.75a2.25 2.25 0 1 1 4.5 0c0 1.5-2.25 1.5-2.25 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <circle cx="12" cy="17" r="1" fill="currentColor" />
            </svg>
        ),
        placeholder: 'Enter links separated by comma or space',
    },
];

export const Ambassadors = () => {
    const { points, getAll, saveLinks, isLoading } = useAmb();
    const auth = useAuth();

    // локально храним значение каждого поля
    const [linksMap, setLinksMap] = useState<Record<string, string>>({});

    // объединяем ссылки при загрузке
    const appendLink = (existing: string | undefined, newLink: string) => {
        if (!existing) return newLink;
        const separator = existing.includes(',') || existing.includes(' ') ? ' ' : ',';
        return existing + separator + newLink;
    };

    // Загрузка данных с бэкенда
    useEffect(() => {
        const load = async () => {
            const token = auth.user?.id_token;
            if (!token) return;

            await getAll(token);
            const storedLinks = useAmb.getState().links;

            const mapped: Record<string, string> = {};
            storedLinks.forEach(({ type, link }) => {
                mapped[type] = appendLink(mapped[type], link);
            });

            setLinksMap(mapped);
        };

        if (auth.user?.id_token) load();
    }, [auth.user?.id_token, getAll]);

    // Сохраняем все ссылки
    const saveAllLinks = async () => {
        const token = auth.user?.id_token;
        if (!token) return;

        // Преобразуем локальный map в массив объектов { type, link }
        const linksToSave: SocialLink[] = Object.entries(linksMap)
            .flatMap(([type, val]) =>
                val.split(/[\s,]+/).map(l => l.trim()).filter(Boolean).map(link => ({ type: type as SocialLink['type'], link }))
            );

        if (linksToSave.length === 0) return;

        await saveLinks(token, linksToSave);
    };

    return (
        <>
            {/* Points block */}
            <h2 style={{ marginBottom: '1rem' }}>Tell people about YouHold on social media and receive an airdrop</h2>
            <div
                style={{
                    width: '50vw',
                    border: '1px solid rgba(255,255,255,.15)',
                    borderRadius: 8,
                    padding: '1rem',
                    background: 'rgb(44,62,80)',
                    textAlign: 'center',
                    margin: '0 auto 1rem auto',
                }}
            >
                <p>
                    Earned:{' '}
                    <strong>{Number(points).toFixed(2)} UHLD</strong>
                </p>
                <p style={{ fontStyle: 'italic', color: 'lightgray' }}>
                    Data is updated once a week
                </p>
            </div>

            {/* Social cards */}
            <h2>Your accounts:</h2>
            <div
                style={{
                    display: 'flex',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginTop: '1rem',
                }}
            >
                {SOCIALS.map(s => (
                    <div
                        key={s.id}
                        style={{
                            width: 260,
                            border: '1px solid rgba(255,255,255,.15)',
                            borderRadius: 8,
                            padding: '1rem',
                            background: 'rgb(44,62,80)',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <div>{s.icon}</div>
                        <h3 style={{ marginTop: 0 }}>{s.name}</h3>

                        <input
                            type="text"
                            placeholder={s.placeholder}
                            value={linksMap[s.id] || ''}
                            onChange={e =>
                                setLinksMap(prev => ({
                                    ...prev,
                                    [s.id]: e.target.value,
                                }))
                            }
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: 6,
                                border: '1px solid gray',
                                textAlign: 'center',
                                background: 'rgb(55,75,95)',
                                color: '#fff',
                            }}
                        />
                    </div>
                ))}


            </div>

            <button
                onClick={saveAllLinks}
                style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    color: '#fff',
                    background: 'linear-gradient(135deg,#7fd05a,#5aa63b)',
                    height: '3rem',
                    opacity: isLoading ? 0.3 : 1,

                }}
            >
                Save All
            </button>
        </>
    );
};
