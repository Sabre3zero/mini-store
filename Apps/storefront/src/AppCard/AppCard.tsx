import styles from "./AppCard.module.css";
import { AppCardTypes } from "../data/types";

export function AppCard({ image, title, text }: AppCardTypes) {
  return (
    <section className={styles.card}>
      <img src={image} />
      <h2>{title}</h2>
      <p>{text}</p>
    </section>
  );
}
