import { Mat, Rect, COLOR_BGR2GRAY, Vec2, THRESH_BINARY_INV } from 'opencv4nodejs'

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
