import styles from "./AdminAppCard.module.css";

type AdminAppCardProps = {
  id: number | string;
  image: string;
  title: string;
  description: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function AdminAppCard({ 
  id, 
  image, 
  title, 
  description, 
  onEdit, 
  onDelete 
}: AdminAppCardProps) {
  return (
    <section className={styles.card}>
      <img src={image} alt={title} />
      <div className={styles.content}>
        <h2>{title || "Без названия"}</h2>
        <p>{description || "Нет описания"}</p>
        <div className={styles.actions}>
          <button 
            className={styles.editBtn} 
            onClick={() => onEdit?.(String(id))}
          >
            Редактировать
          </button>
          <button 
            className={styles.deleteBtn} 
            onClick={() => onDelete?.(String(id))}
          >
            Удалить
          </button>
        </div>
      </div>
    </section>
  );
}