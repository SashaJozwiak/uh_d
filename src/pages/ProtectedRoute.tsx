import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const auth = useAuth();

    if (auth.isLoading)
        return (
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    color: '#fff',
                }}
            >
                Loading...
            </div>
        );

    if (!auth.isAuthenticated) return <Navigate to="/" />;

    return children;
}
