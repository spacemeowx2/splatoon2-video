import React, { useCallback, useState } from 'react'
import { View, Button, useEventHandler, Text, LineEdit } from '@nodegui/react-nodegui'
import { QFileDialog, FileMode, QPushButtonSignals } from '@nodegui/nodegui'
import { styled } from './styled'
import { Section, Gap, Line } from './components/common'
import { selectFolder } from './common'
import { join, resolve } from 'path'

const Box = styled(View)`
  padding: 10px;
`

type MainProps = {
}

const DefaultOutFolder = resolve('./out')

export const Main: React.FC<MainProps> = ({}) => {
  const [ inFolder, setInFolder ] = useState('')
  const [ outFolder, setOutFolder ] = useState(DefaultOutFolder)

  return <>
    <Box>
      <Section>
        <Line>
          <Text>小视频文件夹</Text>
          <Button on={useEventHandler<QPushButtonSignals>({
            clicked () {
              setInFolder(selectFolder())
            }
          }, [])} text='浏览' />
        </Line>
        <Gap />
        <LineEdit text={inFolder} readOnly />
      </Section>
      <Gap />
      <Section>
        <Line>
          <Text>输出文件夹</Text>
          <Button on={useEventHandler<QPushButtonSignals>({
            clicked () {
              setOutFolder(selectFolder())
            }
          }, [])} text='浏览' />
        </Line>
        <Gap />
        <LineEdit text={outFolder} readOnly />
      </Section>
    </Box>
  </>
}
