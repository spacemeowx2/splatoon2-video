import React, { useMemo } from 'react'
import { View } from '@nodegui/react-nodegui'

type PropsOf<
  C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = JSX.LibraryManagedAttributes<C, React.ComponentPropsWithRef<C>>

export function styled<Tag extends React.ComponentType<any>>(tag: Tag | string) {
  const T = tag
  return (css: TemplateStringsArray) => {
    const style = css.join('')
    const C: React.FC<PropsOf<Tag>> = ({...props}) => {
      return <T style={style} {...props} />
    }
    return C
  }
}
