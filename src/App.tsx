import './data/style_variables.css'
import styles from './App.module.css'
import { AppCard } from './AppCard/AppCard'
import { useEffect, useState } from 'react'
import { AppsTypes } from './data/types'


export default function App() {
  
  let [text, setText] = useState('')

  let [check, setCheck] = useState(false)

  let [apps, setApps] = useState<AppsTypes[]>([])

  async function getData() {
    let response = await fetch("https://ministor.ru/api/apps?q=&categoryId=&platform=")
    let data = await response.json()
    setApps(data.items)
  }

  useEffect(() => {
    getData()
  }, [])

  let filteredApps = apps.filter(app => {
    let matchesText = text === '' || app.title.toLowerCase().includes(text.toLowerCase())
    let matchesPrice = !check || app.price === 0
    return matchesText && matchesPrice
})

  let inputHandler = function (event: React.ChangeEvent<HTMLInputElement>) {
    let text = event.currentTarget.value
    setText(text)
  }

  let checkHandler = function (event: React.ChangeEvent<HTMLInputElement>) {
    let check = event.currentTarget.checked
    setCheck(check)
  }

  return (
    <>
      <header>
        <h1 className={styles.header}>MiniStore</h1>
      </header>

      <div>
        <input type='text' onChange={inputHandler}/>
        <input type='checkbox' onChange={checkHandler}/>
      </div>

      <main>
        {filteredApps.map(({id, cover: {url}, title, description}) => (
        <AppCard
          key={id}
          image={"https://ministor.ru"+url}
          title={title}
          text={description}
        />
        ))}
      </main>
    </>
  );
}
