import React from 'react'
import { Text, Window, hot, View } from '@nodegui/react-nodegui'

export const App: React.FC = ({}) => {
  return <>
    <Window
      windowTitle='Splatoon2 Video'
    >
      <View>
        <Text>Welcome to NodeGui 🐕</Text>
      </View>
    </Window>
  </>
}
