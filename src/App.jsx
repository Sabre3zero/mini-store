import styles from './App.module.css'


export default function App() {
  return (
    <>
      <h1 className={styles.header}>MiniStore</h1>
      <main>
        <section className={styles.card}>
          <h2>Product 1</h2>
          <p>Text</p>
          <span>27/04</span>
        </section>

        <section className={styles.card}>
          <h2>Product 2</h2>
          <p>Text</p>
          <span>28/04</span>
        </section>

        <section className={styles.card}>
          <h2>Product 3</h2>
          <p>Text</p>
          <span>2/04</span>
        </section>
      </main>
    </>
  );
}
