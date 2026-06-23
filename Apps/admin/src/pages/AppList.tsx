import { Redirect, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { getApps, deleteApp } from "@ministore/api";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/useStore";
import { AdminAppCard } from "../AdminAppCard/AdminAppCard";
import { AppsTypes } from "@ministor/storefront/src/data/types";

export const AppList = observer(function () {
  const [, setLocation] = useLocation();
  const {userStore} = useStore()
  const [apps, setApps] = useState<AppsTypes[]>([]);
  const [loading, setLoading] = useState(false);

  const loadApps = async () => {
    if (!userStore.token) return;
    
    setLoading(true);
    try {
      const data = await getApps(userStore.token);
      setApps(data);
    } catch (error) {
      console.error("Failed to load apps:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  if (!userStore.token) {
    return <Redirect to="/" replace />;
  }

  const handleLogout = () => {
    userStore.logout()
    setLocation('/');
  }

  const handleEdit = (id: string) => {
    setLocation(`/admin/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!userStore.token) return;
    
    if (!window.confirm("Вы уверены, что хотите удалить это приложение?")) {
      return;
    }

    try {
      await deleteApp({ token: userStore.token, id });
      await loadApps();
    } catch (error) {
      console.error("Failed to delete app:", error);
      alert("Не удалось удалить приложение");
    }
  };

  return (
    <main>
      <h1>Список приложений</h1>

      <div className="actions">
        <button type="button" onClick={() => setLocation('/admin/create')}>
          Создать
        </button>
        <button type="button" onClick={handleLogout}>
          Выйти
        </button>
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="apps-grid">
          {apps.map(({ id, cover, title, description }) => (
            <AdminAppCard
              key={id}
              id={id}
              image={cover?.url ? "https://ministor.ru" + cover.url : "/fallback-image.jpg"}
              title={title}
              description={description}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  );
})