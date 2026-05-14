import './data/style_variables.css'
import styles from './App.module.css'
import {AppCard} from './AppCard/AppCard'
import {apps, unique_tags} from './data/variables'
import {useEffect, useState} from 'react'


export default function App() {
  
  let [text, setText] = useState('')
  let [selectedApps, setSelectedApps] = useState(apps)

  let [check, setCheck] = useState(false)

  let [selection, setSelection] = useState('none')

  useEffect(() => {

    let filtered = apps
    
    if (text !== '') {
      filtered = filtered.filter(app => {
        return app.title.toLowerCase().includes(text.toLowerCase()) || app.tags.some(tag => tag.toLowerCase().includes(text.toLowerCase()))
      })
    }
    else {
      setSelectedApps(apps)
    }

    if (selection !== 'none') {
      filtered = filtered.filter(app => {
        return app.tags.includes(selection)
      })
    }

    if (check) {
      filtered = filtered.filter(app => {
        return app.tags.includes('free')
      })
    }

    setSelectedApps(filtered)

  }, [text, check, selection]);

  let inputHandler = function (event: React.ChangeEvent<HTMLInputElement>) {
    let text = event.currentTarget.value
    setText(text)
  }

  let checkHandler = function (event: React.ChangeEvent<HTMLInputElement>) {
    let check = event.currentTarget.checked
    setCheck(check)
  }

  let selectHandler = function (event: React.ChangeEvent<HTMLSelectElement>) {
    let selected = event.currentTarget.value
    setSelection(selected)
  }


  return (
    <>
      <header>
        <h1 className={styles.header}>MiniStore</h1>
      </header>

      <div>
        <input type='text' onChange={inputHandler}/>
        <input type='checkbox' onChange={checkHandler}/>
        <select onChange={selectHandler}>
          <option>none</option>
          {unique_tags.map((tag: string) => 
          <option>{tag}</option>)}
        </select>
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
