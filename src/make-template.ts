import { readdirSync } from 'fs'
import { join } from 'path'
import { imread, imwrite, Vec2 } from 'opencv4nodejs'
import { getSkills } from './common'

const Base = 'template/source'
const Subs = new Set()
const Specials = new Set()
for (const f of readdirSync(Base)) {
    const [ subName, specialName ] = f.split('.jpg')[0].split('-')
    const fn = join(Base, f)
    const [ sub, special ] = getSkills(imread(fn), new Vec2(-15, 7))
    imwrite(join('template/sub', `${subName}.png`), sub)
    imwrite(join('template/special', `${specialName}.png`), special)
    Subs.add(subName)
    Specials.add(specialName)
}
console.log('Done')
console.log([...Subs.values()], [...Specials.values()])
