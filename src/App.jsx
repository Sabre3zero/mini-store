import './style_variables.css'
import styles from './App.module.css'
import {AppCard} from './AppCard'
import {apps} from './variables'
import {useEffect, useState} from 'react'


export default function App() {
  
  let [text, setText] = useState('')
  let [selectedApps, setSelectedApps] = useState(apps)

  let [check, setCheck] = useState(false)

  useEffect(() => {

    let filtered = apps
    
    if (text !== ''){
      filtered = filtered.filter(app => {
        return app.title.toLowerCase().includes(text.toLowerCase()) || app.tags.some(tag => tag.toLowerCase().includes(text.toLowerCase()))
      })
    }
    else {
      setSelectedApps(apps)
    }

    if (check){
      filtered = filtered.filter(app => {
        return app.tags.includes('free')
      })
    }

    setSelectedApps(filtered)

  }, [text, check]);

  let inputHandler = function (event) {
    let text = event.currentTarget.value
    setText(text)

  }

  let checkHandler = function (event) {
    let check = event.currentTarget.checked
    setCheck(check)
  }


  return (
    <>
      <header>
        <h1 className={styles.header}>MiniStore</h1>
      </header>

      <div>
        <input type='text' onInput={inputHandler}/>
        <input type='checkbox' onChange={checkHandler}/>
      </div>

      <main>
        {selectedApps.map(({image, title, text, tags}) => (
        <AppCard
          image={image}
          title={title}
          text={text}
          tags={tags}
        />
        ))}
      </main>
    </>
  );
}
