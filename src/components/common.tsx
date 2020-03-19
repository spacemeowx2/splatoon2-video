import React from 'react'
import { styled } from '../styled'
import { View } from '@nodegui/react-nodegui'

export const Section = styled(View)`
  border: 1px solid grey;
  padding: 8px;
  border-radius: 3px;
`

export const Gap = styled(View)`
  height: 8px;
`

export const Line = styled(View)`
  flex-direction: row;
`
