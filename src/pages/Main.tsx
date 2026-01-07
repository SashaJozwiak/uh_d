
import { useAuth } from "react-oidc-context";

export default function Main() {

    const auth = useAuth();
    console.log('auth data:', auth);

    return <h1>Dashboard — You are logged in!</h1>;
}
