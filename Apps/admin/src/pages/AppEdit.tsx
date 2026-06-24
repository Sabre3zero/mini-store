// pages/AppEdit.tsx
import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/useStore";
import { getApp, updateApp, AppFields } from "@ministore/api";
import { AppForm } from "../components/AppForm";

export const AppEdit = observer(function () {
  const { userStore } = useStore();
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initialData, setInitialData] = useState<AppFields | null>(null);

  const appId = params.id;

  useEffect(() => {
    const loadApp = async () => {
      if (!appId) {
        setError("ID приложения не найден");
        setLoading(false);
        return;
      }

      if (!userStore.token) {
        setError("Токен не найден. Пожалуйста, войдите заново.");
        setLoading(false);
        return;
      }

      try {
        const appData = await getApp({ token: userStore.token, id: appId });

        const app = appData.item || appData;

        setInitialData({
          categoryId: app.categoryId || app.category?.id || "",
          description: app.description || "",
          price: app.price || 0,
          slug: app.slug || "",
          title: app.title || "",
          cover: app.cover || null,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось загрузить приложение",
        );
      } finally {
        setLoading(false);
      }
    };

    loadApp();
  }, [appId, userStore.token]);

  const handleUpdateApp = async (args: { token: string; body: AppFields }) => {
    if (!appId) {
      throw new Error("ID приложения не найден");
    }

    return await updateApp({
      token: args.token,
      id: appId,
      body: args.body,
    });
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          color: "white",
          fontSize: "18px",
        }}
      >
        Загрузка...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          color: "white",
          padding: "20px",
        }}
      >
        <div
          style={{
            color: "#f44336",
            fontSize: "18px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
        <button
          onClick={() => setLocation("/admin")}
          style={{
            padding: "10px 24px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ← Вернуться к списку
        </button>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          color: "white",
          padding: "20px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>Приложение не найдено</div>
        <button
          onClick={() => setLocation("/admin")}
          style={{
            padding: "10px 24px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ← Вернуться к списку
        </button>
      </div>
    );
  }

  return (
    <AppForm
      onSubmit={handleUpdateApp}
      isEdit={true}
      initialData={initialData}
    />
  );
});
