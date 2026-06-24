import { ChangeEvent, useState } from "react";
import { useLocation } from "wouter";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/useStore";
import styles from "./Login.module.css";

type LoginForm = {
  email: string;
  password: string;
};

export const Login = observer(function () {
  const { userStore } = useStore();
  const [, setLocation] = useLocation();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  function handleFieldChange(event: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await userStore.login(form);
      setLocation("/admin");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Не удалось войти. Попробуйте ещё раз";
      
      if (message.toLowerCase().includes("email") || message.toLowerCase().includes("password")) {
        setError("Неверный email или пароль");
      } else if (message.toLowerCase().includes("network")) {
        setError("Ошибка сети. Проверьте подключение");
      } else {
        setError(`${message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <h1>Mini<span>Store</span></h1>
          <p>Административная панель</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleFieldChange}
              placeholder="admin@example.com"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleFieldChange}
              placeholder="••••••••"
              required
              disabled={isLoading}
              autoComplete="current-password"
              minLength={6}
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Вход...
              </>
            ) : (
              "Войти"
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>© 2026 MiniStore. Все права защищены.</p>
        </div>
      </div>
    </div>
  );
});