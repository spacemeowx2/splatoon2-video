import { Renderer } from '@nodegui/react-nodegui'
import React from 'react'
import { HotApp } from './App'

process.title = 'Splatoon2 Video'
Renderer.render(<HotApp />)

// This is for hot reloading (this will be stripped off in production by webpack)
if (module.hot) {
  module.hot.accept(['./App'], function() {
    Renderer.forceUpdate()
  })
}
