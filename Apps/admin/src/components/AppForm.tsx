import { ChangeEvent, SubmitEventHandler, useEffect, useState } from "react";
import { CreateAppArgs, uploadImage } from "@ministore/api";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/useStore";
import { AppFields, CategoryParams, Cover } from "@ministore/api";
import { useLocation } from "wouter";
import { ImageUpload } from "../pages/ImageUpload";
import styles from "./AppForm.module.css";

type AppFormProps = {
  onSubmit: (value: CreateAppArgs) => Promise<void>;
  isEdit?: boolean;
  initialData?: AppFields | null;
};

export const AppForm = observer(({ onSubmit, isEdit = false, initialData = null}: AppFormProps) => {
  const { userStore } = useStore();
  const [, setLocation] = useLocation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [form, setForm] = useState<AppFields>({
    categoryId: "",
    description: "",
    price: 0,
    slug: "",
    title: "",
  });

  useEffect(() => {
  if (initialData) {
    setForm({
      categoryId: initialData.categoryId || "",
      description: initialData.description || "",
      price: initialData.price || 0,
      slug: initialData.slug || "",
      title: initialData.title || "",
    });
    
    if (initialData.cover?.url) {
      const coverPath = initialData.cover.url;
      const fullCoverUrl = coverPath.startsWith('/') 
        ? `https://ministor.ru${coverPath}`
        : coverPath;
      setCoverUrl(fullCoverUrl);
      console.log('Setting cover preview URL:', fullCoverUrl);
      
      if (initialData.cover.width && initialData.cover.height) {
        setImageDimensions({
          width: initialData.cover.width,
          height: initialData.cover.height
        });
      }
    }
  }
}, [initialData]);

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

  const handleImageSelect = (file: File | null) => {
    setCoverFile(file);
    setImageDimensions(null);
    
    if (!file) {
      setCoverUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({
          width: img.width,
          height: img.height
        });
        console.log('Image dimensions:', img.width, 'x', img.height);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

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
      let coverData: Cover | null = null;
      
      if (coverFile) {
        setUploadingImage(true);
        try {
          const imagePath = await uploadImage({
            token: userStore.token,
            file: coverFile,
            kind: 'cover',
            slug: form.slug,
          });
          
          coverData = {
            url: imagePath,
            storageKey: null,
            alt: form.title || '',
            width: imageDimensions?.width || 1,
            height: imageDimensions?.height || 1,
            mimeType: coverFile.type || null,
            size: coverFile.size || null
          };
          
          const fullImageUrl = imagePath.startsWith('/') 
            ? `https://ministor.ru${imagePath}`
            : imagePath;
          setCoverUrl(fullImageUrl);
          console.log('Image uploaded:', imagePath);
          console.log('Cover data:', coverData);
        } catch (uploadErr) {
          throw new Error(`Не удалось загрузить изображение: ${uploadErr instanceof Error ? uploadErr.message : ''}`);
        } finally {
          setUploadingImage(false);
        }
      } else if (coverUrl && !coverFile) {
        coverData = {
          url: coverUrl,
          storageKey: null,
          alt: form.title || '',
          width: imageDimensions?.width || 1,
          height: imageDimensions?.height || 1,
          mimeType: null,
          size: null
        };
      }

      const submitData = {
        ...form,
        cover: coverData,
      };

      console.log('Submitting app data:', submitData);

      await onSubmit({ token: userStore.token, body: submitData });
      
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
        setCoverFile(null);
        setCoverUrl(null);
        setImageDimensions(null);
      }

    } catch (err: any) {
      const message = err.message || "Произошла неизвестная ошибка";
      console.error('Error:', message);

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
      } else if (message.includes("width") || message.includes("height")) {
        setError("Не удалось определить размеры изображения. Попробуйте другое изображение.");
      } else {
        setError(`${message}`);
      }
    } finally {
      setIsLoading(false);
      setUploadingImage(false);
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
            disabled={isLoading || uploadingImage}
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
            disabled={isLoading || uploadingImage}
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
            disabled={isLoading || uploadingImage}
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
            disabled={isLoading || uploadingImage || !userStore.categories.length}
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
            disabled={isLoading || uploadingImage}
          />
          <small style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>
            Введите 0 для бесплатного приложения
          </small>
        </div>

        <div className={styles.formGroup}>
          <label>Обложка</label>
          <ImageUpload
            onImageSelect={handleImageSelect}
            currentImage={coverUrl}
            label="Загрузить обложку"
            maxSize={5}
          />
          {uploadingImage && (
            <div style={{ color: '#aaa', fontSize: '13px', marginTop: '4px' }}>
              Загрузка изображения...
            </div>
          )}
          {imageDimensions && !uploadingImage && (
            <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
              Размеры: {imageDimensions.width} x {imageDimensions.height}px
            </div>
          )}
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading || uploadingImage}
          >
            {uploadingImage 
              ? "Загрузка..." 
              : isLoading 
                ? isEdit ? "Сохраняем..." : "Создаем..." 
                : isEdit ? "Сохранить" : "Создать"
            }
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelBtn}
            disabled={isLoading || uploadingImage}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
});