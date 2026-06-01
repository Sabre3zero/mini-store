import "./data/style_variables.css";
import styles from "./App.module.css";
import { AppCard } from "./AppCard/AppCard";
import { useEffect, useState } from "react";
import { AppsTypes } from "./data/types";
import { getData } from "@ministor/api";

export default function App() {
  const [text, setText] = useState("");

  const [check, setCheck] = useState(false);

  const [apps, setApps] = useState<AppsTypes[]>([]);

  useEffect(() => {
    getData().then((data) => setApps(data));
  }, []);

  const filteredApps = apps.filter((app) => {
    const matchesText =
      text === "" || app.title.toLowerCase().includes(text.toLowerCase());
    const matchesPrice = !check || app.price === 0;
    return matchesText && matchesPrice;
  });

  const inputHandler = function (event: React.ChangeEvent<HTMLInputElement>) {
    const text = event.currentTarget.value;
    setText(text);
  };

  const checkHandler = function (event: React.ChangeEvent<HTMLInputElement>) {
    const check = event.currentTarget.checked;
    setCheck(check);
  };

  return (
    <>
      <header>
        <h1 className={styles.header}>MiniStore</h1>
      </header>

      <div>
        <input type="text" onChange={inputHandler} />
        <input type="checkbox" onChange={checkHandler} />
      </div>

      <main>
        {filteredApps.map(({ id, cover: { url }, title, description }) => (
          <AppCard
            key={id}
            image={"https://ministor.ru" + url}
            title={title}
            text={description}
          />
        ))}
      </main>
    </>
  );
}
