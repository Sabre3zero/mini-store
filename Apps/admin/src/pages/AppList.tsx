import { Redirect, useLocation } from "wouter";
import { useEffect } from "react";
import { getApps } from "@ministore/api";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/useStore";

export const AppList = observer(function () {
  const [, setLocation] = useLocation();
  const {userStore} = useStore()

  useEffect(() => {
    if (userStore.token) {
      getApps(userStore.token);
    }
  }, []);

  if (!userStore.token) {
    return <Redirect to="/" replace />;
  }

  const handleLogout = () => {
    userStore.logout()
    setLocation('/');
  }

  return (
    <main>
      <h1>Список приложений</h1>

      <button type="button" onClick={() => setLocation('/admin/create')}>
        Создать
      </button>

      <button type="button" onClick={handleLogout}>
        Выйти
      </button>
    </main>
  );
})
