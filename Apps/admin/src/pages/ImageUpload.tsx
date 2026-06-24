// components/ImageUpload.tsx
import { useState, useRef, ChangeEvent, useEffect } from "react";
import styles from "./ImageUpload.module.css";

type ImageUploadProps = {
  onImageSelect: (file: File | null) => void;
  currentImage?: string | null;
  label?: string;
  accept?: string;
  maxSize?: number;
};

export function ImageUpload({ 
  onImageSelect, 
  currentImage, 
  label = "Загрузить изображение",
  accept = "image/*",
  maxSize = 5
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
  if (currentImage) {
    console.log('Setting preview from currentImage:', currentImage);
    setPreview(currentImage);
  }
}, [currentImage]);

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setPreview(null);
      onImageSelect(null);
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`Файл слишком большой. Максимальный размер: ${maxSize}MB`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    setError("");
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    onImageSelect(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    setPreview(null);
    setError("");
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ""} ${preview ? styles.hasPreview : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className={styles.hiddenInput}
          aria-label={label}
        />
        
        {preview ? (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Preview" className={styles.preview} />
            <div className={styles.previewOverlay}>
              <span className={styles.changeText}>Нажмите чтобы изменить</span>
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.icon}>🖼️</div>
            <p className={styles.label}>{label}</p>
            <p className={styles.subLabel}>Нажмите или перетащите изображение</p>
            <p className={styles.sizeLimit}>Максимум {maxSize}MB</p>
          </div>
        )}
      </div>
      
      {preview && (
        <button 
          type="button" 
          onClick={handleRemove}
          className={styles.removeBtn}
        >
          Удалить
        </button>
      )}
      
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}