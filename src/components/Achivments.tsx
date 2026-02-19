import { useState } from 'react';

type Achievement = {
    id: number;
    icon: string;
    title: string;
    description: string;
    reward: number;
    converted: boolean;
};

const MOCK_ACHIEVMENTS: Achievement[] = [
    {
        id: 1,
        icon: '🚀',
        title: 'Early Adopter',
        description: 'Register during the beta phase of the platform.',
        reward: 500,
        converted: false,
    },
    {
        id: 2,
        icon: '🔥',
        title: '100 Transactions',
        description: 'Complete 100 successful transactions.',
        reward: 1200,
        converted: false,
    },
    {
        id: 3,
        icon: '💎',
        title: 'Whale Investor',
        description: 'Invest more than 10,000 USDT in total.',
        reward: 5000,
        converted: false,
    },
    {
        id: 4,
        icon: '🎯',
        title: 'Completed All Tasks',
        description: 'Finish all available tasks in your dashboard.',
        reward: 2500,
        converted: false,
    },
    {
        id: 5,
        icon: '🤝',
        title: 'Referral Master',
        description: 'Invite 10 active users through your referral link.',
        reward: 1500,
        converted: false,
    },
    {
        id: 6,
        icon: '📈',
        title: 'Top Trader',
        description: 'Reach trading volume of 50,000 USDT.',
        reward: 3000,
        converted: false,
    },
    {
        id: 7,
        icon: '🌍',
        title: 'Community Supporter',
        description: 'Share your referral link on 3 social networks.',
        reward: 800,
        converted: false,
    },
    {
        id: 8,
        icon: '🏆',
        title: 'Platform Champion',
        description: 'Complete all achievements.',
        reward: 10000,
        converted: false,
    },
];

export const Achivments = () => {
    const [items, setItems] = useState(MOCK_ACHIEVMENTS);

    const convert = (id: number) => {
        setItems(prev =>
            prev.map(a =>
                a.id === id ? { ...a, converted: true } : a
            )
        );

        console.log('Convert achievement:', id);
    };

    return (
        <div
            style={{
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}
        >
            {items.map(a => (
                <div
                    key={a.id}
                    style={{
                        width: 240,
                        border: '1px solid rgba(255,255,255,.15)',
                        borderRadius: 8,
                        padding: '1rem',
                        background: 'rgb(44,62,80)',
                        boxShadow: '0 12px 30px rgba(0,0,0,.25)',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>
                        {/* Icon */}
                        <div style={{ fontSize: '2rem' }}>{a.icon}</div>

                        {/* Title */}
                        <h3 style={{ margin: '0.5rem 0' }}>{a.title}</h3>

                        {/* Description */}
                        <p
                            style={{
                                fontSize: '1rem',
                                //opacity: 1,
                                minHeight: 50,
                                color: 'gray'
                            }}
                        >
                            {a.description}
                        </p>

                        {/* Reward */}
                        <p style={{ marginTop: '0.5rem' }}>
                            Reward:{' '}
                            <b>{a.reward.toLocaleString()} UHLD</b>
                        </p>
                    </div>

                    {/* Button / Status */}
                    {a.converted ? (
                        <p
                            style={{
                                marginTop: '0.75rem',
                                color: '#7fd05a',
                                fontWeight: 'bold',
                            }}
                        >
                            Converted ✔
                        </p>
                    ) : (
                        <button
                            onClick={() => convert(a.id)}
                            style={{
                                marginTop: '0.75rem',
                                padding: '0.5rem 1rem',
                                borderRadius: 6,
                                border: 'none',
                                cursor: 'pointer',
                                color: '#fff',
                                background:
                                    'linear-gradient(135deg, #7fd05a, #5aa63b)',
                                boxShadow:
                                    '0 4px 15px rgba(127,208,90,.35)',
                            }}
                        >
                            Convert to UHLD
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};
