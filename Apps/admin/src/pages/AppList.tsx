import { Redirect, useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { getApps } from "@ministore/api";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/useStore";
import { AppCard } from "@ministor/storefront/src/AppCard/AppCard";
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
            <div key={id} className="app-item">
              <AppCard
                image={cover?.url ? "https://ministor.ru" + cover.url : "/fallback-image.jpg"}
                title={title}
                text={description}
              />
              <div className="app-actions">
                <Link href={`/admin/edit/${id}`}>
                  <button className="edit-btn">Редактировать</button>
                </Link>
                <Link href={`/admin/delete/${id}`}>
                  <button className="delete-btn">Удалить</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
})