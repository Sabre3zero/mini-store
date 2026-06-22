import { login } from "@ministor/api";
import { ChangeEvent, SubmitEvent, useState } from "react";
import { useLocation } from "wouter";
import { saveToken } from "../tokenStorage";


type LoginForm = {
    email: string;
    password: string;
}


export function Login() {
    const [, setLocation] = useLocation();
    const [error, setError] = useState('');

    const [form, setForm] = useState<LoginForm>({
        email: '',
        password: '',
    });

    function handleFieldChange(event: ChangeEvent<HTMLInputElement>) {
        setForm({
            ... form,
            [event.target.name]: event.target.value,
        });
    };

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        try {
            const token = await login(form);

            saveToken(token);
            setLocation('/admin');
        } catch {
            setError('Не удалось войти. Попробуйте ещё раз');
        }
    };

    return (
        <main>
            <h1>Вход в админку</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input 
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleFieldChange}
                        required
                    />
                </label>

                <label>
                    Пароль
                    <input 
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleFieldChange}
                        required
                    />
                </label>

                <button type="submit">Войти</button>
            </form>

            {error && <p role="alert">{error}</p>}
        </main>
    )
};
