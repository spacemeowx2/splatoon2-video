import React, { useState, useCallback, useRef } from 'react'
import { View, Button, useEventHandler, Text, LineEdit, ProgressBar } from '@nodegui/react-nodegui'
import { QPushButtonSignals } from '@nodegui/nodegui'
import { styled } from './styled'
import { Section, Gap, Line } from './components/common'
import { selectFolder, messageBox, sleep } from './common'
import { resolve } from 'path'
import { detect, CallbackContent } from './detect'
import open from 'open'

const Box = styled(View)`
  padding: 10px;
`

const DefaultOutFolder = resolve('./out')

const CountView: React.FC<{ count: CallbackContent }> = ({ count }) => {
  return <View>
    <Text>{`已发现文件: ${count.totalFileCount}`}</Text>
    <Gap />
    <Text>{`输出文件夹已存在文件: ${count.totalOutFileCount}`}</Text>
    <Gap />
    <Text>{`有效视频文件: ${count.validFileCount}`}</Text>
    <Gap />
    <Text>{`已检测文件: ${count.detectedVideo}`}</Text>
    <Gap />
    <Text>{`已复制文件: ${count.copyCount}`}</Text>
    <Gap />
    <Text>{`已跳过文件: ${count.skipCount}`}</Text>
  </View>
}

export const Main: React.FC = () => {
  const [ inFolder, setInFolder ] = useState('')
  const [ outFolder, setOutFolder ] = useState(DefaultOutFolder)
  const [ detecting, setDetecting ] = useState(false)
  const [ count, setCount ] = useState<CallbackContent | undefined>(undefined)
  const abort = useRef(false)
  const callback = useCallback(async (count: CallbackContent) => {
    if (abort.current) {
      abort.current = false
      throw new Error('用户选择了取消')
    }
    setCount(count)
    await sleep()
  }, [])
  const onStart = useEventHandler<QPushButtonSignals>({
    clicked: async () => {
      try {
        setDetecting(true)
        await sleep()
        if (!inFolder) {
          return messageBox('请选择输入文件夹')
        }
        await detect(inFolder, outFolder, callback)
      } catch(e) {
        messageBox(`已中止: ${e.message}`)
      } finally {
        setDetecting(false)
      }
    }
  }, [ inFolder, outFolder, callback ])
  const onStop = useEventHandler<QPushButtonSignals>({
    clicked() {
      abort.current = true
    }
  }, [])

  return <>
    <Box>
      <View enabled={!detecting}>
        <Section>
          <Line>
            <Text>小视频文件夹</Text>
            <Button on={useEventHandler<QPushButtonSignals>({
              clicked () {
                setInFolder(selectFolder())
              }
            }, [])} text='浏览' />
            <Button enabled={!!inFolder} on={useEventHandler<QPushButtonSignals>({
              clicked () {
                open(inFolder)
              }
            }, [ inFolder  ])} text='打开' />
          </Line>
          <Gap />
          <LineEdit text={inFolder} readOnly />
        </Section>
        <Gap />
        <Section>
          <Line>
            <Text>复制到文件夹</Text>
            <Button on={useEventHandler<QPushButtonSignals>({
              clicked () {
                setOutFolder(selectFolder())
              }
            }, [])} text='浏览' />
            <Button on={useEventHandler<QPushButtonSignals>({
              clicked () {
                open(outFolder)
              }
            }, [ outFolder ])} text='打开' />
          </Line>
          <Gap />
          <LineEdit text={outFolder} readOnly />
        </Section>
      </View>
      <Gap />
      { detecting ? <Button text='停止' on={onStop} /> : <Button text='开始分类!' on={onStart} />}
      <Gap />
      <View>
        { count && <>
          <CountView count={count} />
        </>}
      </View>
    </Box>
  </>
}
