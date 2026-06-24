// pages/AppDelete.tsx
import { useStore } from "../stores/useStore";
import { observer } from "mobx-react-lite";
import { deleteApp } from "@ministore/api";
import { useLocation, useParams } from "wouter";
import { useState, useEffect } from "react";

export const AppDelete = observer(function () {
  const { userStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const appId = params.id;

  useEffect(() => {
    if (!appId) {
      setError("ID приложения не найден");
    }
  }, [appId]);

  const handleDelete = async () => {
    if (!appId) return;

    const token = userStore.token;
    if (!token) {
      setError("Токен не был найден. Попробуйте ещё раз.");
      return;
    }

    if (
      !window.confirm(
        "Вы уверены, что хотите удалить это приложение? Это действие нельзя отменить.",
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await deleteApp({ token, id: appId });
      setSuccess(true);

      setTimeout(() => {
        setLocation("/admin");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при удалении");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setLocation("/admin");
  };

  return (
    <div className="delete-container">
      <h2>Удаление приложения</h2>

      {error && <div className="error">{error}</div>}
      {success && (
        <div className="success">
          Приложение успешно удалено! Перенаправление...
        </div>
      )}

      {!success && !error && (
        <>
          <p>Вы действительно хотите удалить приложение #{appId}?</p>
          <div className="actions">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="delete-btn"
            >
              {loading ? "Удаление..." : "Удалить"}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="cancel-btn"
            >
              Отмена
            </button>
          </div>
        </>
      )}
    </div>
  );
});
