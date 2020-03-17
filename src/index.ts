import { VideoCapture, Mat, imwrite, imread, Vec3 } from 'opencv4nodejs'
import { preProcess, getSkills, binary, videoCapture, walkDir, mkdirp } from './common'
import { basename, join } from 'path'
import { promises as fs } from 'fs'

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

async function detectVideo(filename: string, skipFrame = 30) {
    const vc = new VideoCapture(filename)
    const result: Record<string, number> = {}

    for await (const img of videoCapture(vc, skipFrame)) {
        const [ subImg, specialImg ] = getSkills(img)
        const [ special ] = await match('special', specialImg)
        const [ sub ] = await match('sub', subImg)
        const key = `${sub}_${special}`
        result[key] = (result[key] ?? 0) + 1
    }

    const max = Object.entries(result).reduce(([pk, pv], [ck, cv]) => cv > pv ? [ck, cv] : [pk, pv], ['unknown', -Infinity])

    return max
}

const SwitchVideoRE = /\d{16}-[0-9A-F]{32}.mp4/
async function main([ inpath, outpath ]: string[]) {
    const copyPromise: Promise<void>[] = []
    const out = outpath || 'out'
    await mkdirp(out)

    for await (const filename of walkDir(inpath)) {
        const fn = basename(filename)
        if (SwitchVideoRE.test(fn)) {
            const [result, score] = await detectVideo(filename, 30 * 5)
            console.log(fn, result, score)

            const outDir = join(out, result)
            await mkdirp(outDir)
            copyPromise.push(fs.copyFile(filename, join(outDir, fn)))
        }
    }

    await Promise.all(copyPromise)
    console.log('Copy done')
}
main(process.argv.slice(2)).catch(err => console.error(err))
