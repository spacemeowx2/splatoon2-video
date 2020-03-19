import React from 'react'
import {  Window, hot, } from '@nodegui/react-nodegui'
import { Main } from './Main'

const minSize = { width: 500, height: 520 }
class App extends React.Component {
  render() {
    return <>
      <Window
        windowTitle='Splatoon2 Video'
        minSize={minSize}
      >
        <Main />
      </Window>
    </>
  }
}

export const HotApp = hot(App)
