import styles from './AppCard.module.css'
import {AppCardTypes} from '../data/types'

export function AppCard({
  image,
  title,
  text,
  tags
}: AppCardTypes) {
    return (
      <section className={styles.card}>
        <img src={image}/>
        <h2>{title}</h2>
        <p>{text}</p>
        <div className={styles.tag_container}>
          {tags.map((tag: string) => 
          <div className={styles.tag}>{tag}</div>
          )}
        </div>
      </section>
    )
}