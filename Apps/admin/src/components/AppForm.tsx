// components/AppForm.tsx
import { ChangeEvent, SubmitEventHandler, useEffect, useState } from "react";
import { CreateAppArgs } from "@ministore/api";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/useStore";
import { AppFields, CategoryParams } from "@ministore/api";
import { useLocation } from "wouter";
import styles from "./AppForm.module.css";

type AppFormProps = {
  onSubmit: (value: CreateAppArgs) => Promise<void>;
  isEdit?: boolean;
};

export const AppForm = observer(({ onSubmit, isEdit = false }: AppFormProps) => {
  const { userStore } = useStore();
  const [, setLocation] = useLocation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<AppFields>({
    categoryId: "",
    description: "",
    price: 0,
    slug: "",
    title: "",
  });

  useEffect(() => {
    if (!userStore.categories || userStore.categories.length === 0) {
      userStore.loadCat();
    }
  }, [userStore.categories]);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const value = event.target.name === "price" 
      ? Number(event.target.value) || 0 
      : event.target.value;
    
    setForm({
      ...form,
      [event.target.name]: value,
    });
  }

  const handleSubmit: SubmitEventHandler = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!userStore.token) {
      setError("Токен не найден. Пожалуйста, войдите заново.");
      setIsLoading(false);
      return;
    }

    if (!form.title.trim()) {
      setError("Название обязательно");
      setIsLoading(false);
      return;
    }

    if (!form.slug.trim()) {
      setError("Slug обязателен");
      setIsLoading(false);
      return;
    }

    if (!form.categoryId) {
      setError("Пожалуйста, выберите категорию");
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit({ token: userStore.token, body: form });
      setSuccess(
        isEdit 
          ? "Приложение успешно обновлено!" 
          : `Приложение "${form.title}" успешно создано!`
      );
      
      if (!isEdit) {
        setForm({
          categoryId: "",
          description: "",
          price: 0,
          slug: "",
          title: "",
        });
      }

      setTimeout(() => {
        setLocation("/admin");
      }, 2000);
    } catch (err: any) {
      const message = err.message || "Произошла неизвестная ошибка";

      if (message.includes("categoryId обязателен")) {
        setError("Пожалуйста, выберите категорию");
      } else if (
        message.includes("unauthorized") ||
        message.includes("Требуется авторизация")
      ) {
        setError("Сессия истекла. Пожалуйста, войдите заново.");
        userStore.logout();
        setTimeout(() => setLocation("/"), 1500);
      } else if (
        message.includes("forbidden") ||
        message.includes("editor или admin")
      ) {
        setError("У вас недостаточно прав для создания приложения");
      } else if (message.includes("slug")) {
        setError(`${message}`);
      } else {
        setError(`${message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocation("/admin");
  };

  return (
    <div className={styles.formContainer}>
      <header className={styles.header}>
        <h2>{isEdit ? "Редактирование приложения" : "Создание приложения"}</h2>
        <button 
          type="button" 
          onClick={handleCancel}
          className={styles.backBtn}
        >
          ← Назад
        </button>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">
            Название <span className={styles.required}>*</span>
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Введите название приложения"
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="slug">
            Slug <span className={styles.required}>*</span>
          </label>
          <input
            id="slug"
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="например: my-awesome-app"
            disabled={isLoading}
          />
          <small style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>
            Используется в URL: https://ministor.ru/apps/{form.slug || "..."}
          </small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Введите описание приложения"
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="categoryId">
            Категория <span className={styles.required}>*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            disabled={isLoading || !userStore.categories.length}
          >
            <option value="">Выберите категорию</option>
            {userStore.categories.map(({ id, title }: CategoryParams) => (
              <option value={id} key={id}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price">Цена (₽)</label>
          <input
            id="price"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="1"
            disabled={isLoading}
          />
          <small style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>
            Введите 0 для бесплатного приложения
          </small>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading 
              ? isEdit ? "Сохраняем..." : "Создаем..." 
              : isEdit ? "Сохранить" : "Создать"
            }
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelBtn}
            disabled={isLoading}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
});