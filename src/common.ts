import { promises as fs } from 'fs'
import { join } from 'path'
import { Mat, Rect, COLOR_BGR2GRAY, Vec2, THRESH_BINARY_INV, VideoCapture, CAP_PROP_FRAME_COUNT, CAP_PROP_POS_FRAMES } from 'opencv4nodejs'

export function binary(img: Mat) {
    return img.cvtColor(COLOR_BGR2GRAY).threshold(127, 255, THRESH_BINARY_INV)
}

export function preProcess(img: Mat) {
    return img.cvtColor(COLOR_BGR2GRAY).canny(50, 150)
}

export function getRegion(img: Mat, rect: [number, number, number, number], offset?: Vec2) {
    const [ X, Y, W, H ] = rect
    const [ h, w ] = img.sizes

    const mat = img.getRegion(new Rect(w * X + (offset?.x || 0), h * Y + (offset?.y || 0), w * W, h * H))

    return mat
}

export function getSkills(img: Mat, offset?: Vec2) {
    const skills = getRegion(img, [ 0.87, 0.013888888, 0.11, 0.2 ], offset)
    const sub = getRegion(skills, [ 0.056, 0.0555555555, 0.34, 0.3125 ])
    const special = getRegion(skills, [ 0.2837, 0.27778, 0.4397, 0.416667 ])
    return [sub, special]
}

export async function *videoCapture(vc: VideoCapture, skipFrame = 30) {
    const totalFrames = vc.get(CAP_PROP_FRAME_COUNT)

    for (let i = 0; i < totalFrames; i += skipFrame) {
        if (!vc.set(CAP_PROP_POS_FRAMES, i)) {
            throw new Error('CAP_PROP_POS_FRAMES error')
        }
        yield await vc.readAsync()
    }
}

export async function *walkDir(path: string): AsyncGenerator<string> {
    for (const n of await fs.readdir(path)) {
        const a = join(path, n)
        const s = await fs.stat(a)
        if (s.isDirectory()) {
            yield* walkDir(a)
        } else {
            yield a
        }
    }
}

export async function mkdirp(path: string) {
    try {
        await fs.mkdir(path, {
            recursive: true
        })
    } catch (err) {
        if (err.code === 'EEXIST') {
            return
        }
        throw err
    }
}