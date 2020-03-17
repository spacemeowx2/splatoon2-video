import { VideoCapture, Mat, imwrite, imread, Vec3 } from 'opencv4nodejs'
import { preProcess, getSkills, binary } from './common'

const Specials = [
    'InkStorm',
    'AutobombLauncher',
    'BooyahBomb',
    'SuctionBombLauncher',
    'TentaMissiles',
    'Splashdown',
    'StingRay',
    'SplatBombLauncher',
    'Baller',
    'InkArmor',
    'UltraStamp',
    'CurlingBombLauncher',
    'BubbleBlower',
    'BurstBombLauncher',
    'InkJet',
]
const Subs = [
    'Autobomb',    'BurstBomb',
    'CurlingBomb', 'FizzyBomb',
    'InkMine',     'PointSensor',
    'SplashWall',  'SplatBomb',
    'Sprinkler',   'SquidBeakon',
    'SuctionBomb', 'Torpedo',
    'ToxicMist'
]
function loadImg(folder: string, name: string) {
    return imread(`template/${folder}/${name}.png`)
}
type TemplateType = 'special' | 'sub'
const Template = {
    special: Object.fromEntries(Specials.map(i => [i, loadImg('special', i)])) as Record<string, Mat>,
    sub: Object.fromEntries(Subs.map(i => [i, loadImg('sub', i)])) as Record<string, Mat>,
}
const Mask = {
    special: binary(loadImg('special', 'mask')),
    sub: binary(loadImg('sub', 'mask')),
}

async function mse(mask: Mat, template: Mat, img: Mat) {
    const [ h, w ] = template.sizes

    const t = preProcess(template).copy(mask)
    const i = preProcess(img).copy(mask)

    // imwrite('t.png', t)
    // imwrite('i.png', i)

    const r = t.sub(i)
    const s: Vec3 | number = r.hMul(r).sum() as any
    if (typeof s === 'number') {
        return s / (h * w)
    } else {
        return s.div(h * w).norm()
    }
}

async function match(template: TemplateType, img: Mat) {
    const result: Record<string, number> = {}

    const mask = Mask[template]
    for (const [key, t] of Object.entries(Template[template])) {
        result[key] = await mse(mask, t, img)
    }
    const min = Object.entries(result).reduce(([pk, pv], [ck, cv]) => cv < pv ? [ck, cv] : [pk, pv], ['unknown', Infinity])

    // console.log(result)
    return min
}

async function main([ filename ]: string[]) {
    const vc = new VideoCapture(filename)

    for (let i = 0; i < 100; i++) {
        const [ sub, special ] = getSkills(await vc.readAsync())
        console.log(await match('special', special))
        console.log(await match('sub', sub))
    }
    // const result = await special.cannyAsync(3, 20)
    // // result.matchTemplateAsync()
    // imshow('fuck', special)
    // waitKey()
}
main(process.argv.slice(2)).catch(err => console.error(err))
