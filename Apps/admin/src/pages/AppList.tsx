import { Redirect, useLocation } from "wouter";
import { useEffect, useState, useCallback } from "react";
import { getApps, deleteApp } from "@ministore/api";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/useStore";
import { AdminAppCard } from "../AdminAppCard/AdminAppCard";
import { AppsTypes } from "@ministor/storefront/src/data/types";
import styles from "./AppList.module.css";

export const AppList = observer(function () {
  const [, setLocation] = useLocation();
  const { userStore } = useStore();
  const [apps, setApps] = useState<AppsTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const loadApps = useCallback(async () => {
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
  }, [userStore.token]);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  if (!userStore.token) {
    return <Redirect to="/" replace />;
  }

  const handleLogout = () => {
    userStore.logout();
    setLocation("/");
  };

  const handleEdit = (id: string | number) => {
    setLocation(`/admin/edit/${id}`);
  };

  const handleDelete = async (id: string | number) => {
    if (!userStore.token) return;

    if (!window.confirm("Вы уверены, что хотите удалить это приложение?")) {
      return;
    }

    try {
      await deleteApp({ token: userStore.token, id: String(id) });
      await loadApps();
    } catch (error) {
      console.error("Failed to delete app:", error);
      alert("Не удалось удалить приложение");
    }
  };

  const filteredApps = apps.filter((app) => {
    const matchesText =
      searchText === "" ||
      app.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesPrice = !showFreeOnly || app.price === 0;
    return matchesText && matchesPrice;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Админ панель</h1>
        <div className={styles.headerActions}>
          <button
            className={styles.createBtn}
            type="button"
            onClick={() => setLocation("/admin/create")}
          >
            Создать
          </button>
          <button
            className={styles.logoutBtn}
            type="button"
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      </header>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Поиск по названию..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <label className={styles.filterLabel}>
          <input
            type="checkbox"
            checked={showFreeOnly}
            onChange={(e) => setShowFreeOnly(e.target.checked)}
          />
          Только бесплатные
        </label>
      </div>

      {loading ? (
        <div className={styles.loading}>Загрузка приложений...</div>
      ) : filteredApps.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Приложений не найдено</p>
          {searchText && <p>Попробуйте изменить параметры поиска</p>}
        </div>
      ) : (
        <div className={styles.appsGrid}>
          {filteredApps.map(({ id, cover, title, description, price }) => (
            <AdminAppCard
              key={id}
              id={id}
              image={
                cover?.url
                  ? "https://ministor.ru" + cover.url
                  : "/fallback-image.jpg"
              }
              title={title}
              description={description}
              price={price}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
});
