import styles from "./AdminAppCard.module.css";

type AdminAppCardProps = {
  id: string | number;
  image: string;
  title: string;
  description: string;
  price?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function AdminAppCard({
  id,
  image,
  title,
  description,
  price,
  onEdit,
  onDelete,
}: AdminAppCardProps) {
  const handleEdit = () => {
    onEdit?.(String(id));
  };

  const handleDelete = () => {
    onDelete?.(String(id));
  };

  return (
    <section className={styles.card}>
      <img src={image} alt={title} />
      <div className={styles.content}>
        <h2>{title || "Без названия"}</h2>
        <p>{description || "Нет описания"}</p>
        {price !== undefined && (
          <div
            style={{
              color: price === 0 ? "#4CAF50" : "#FFD700",
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            {price === 0 ? "Бесплатно" : `${price} ₽`}
          </div>
        )}
        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={handleEdit}>
            Редактировать
          </button>
          <button className={styles.deleteBtn} onClick={handleDelete}>
            Удалить
          </button>
        </div>
      </div>
    </section>
  );
}
