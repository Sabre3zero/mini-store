import { Redirect, useLocation } from "wouter";
import { clearToken, getToken } from "../tokenStorage";


export function AppList() {
    const [, setLocation] = useLocation();
    const token = getToken();

    if (!token) {
        return <Redirect to='/' replace />;
    }

    function handleLogout() {
        clearToken();
        setLocation('/');
    }

    return (
        <main>
            <h1>Список приложений</h1>
            <button type="button" onClick={handleLogout}>
                Выйти
            </button>
        </main>
    );
};