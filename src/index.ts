import { VideoCapture, imshow, waitKey, Mat, Rect } from 'opencv4nodejs'


function getRegion(img: Mat, rect: [number, number, number, number]) {
    const [ X, Y, W, H ] = rect
    const [ h, w ] = img.sizes
    const mat = img.getRegion(new Rect(w * X, h * Y, w * W, h * H))
    return mat
}

function getSkills(img: Mat) {
    const skills = getRegion(img, [ 0.87, 0.013888888, 0.11, 0.2 ])
    const sub = getRegion(skills, [ 0.056, 0.0555555555, 0.34, 0.3125 ])
    const special = getRegion(skills, [ 0.2837, 0.27778, 0.4397, 0.416667 ])
    return [sub, special]
}

async function main([ filename ]: string[]) {
    const vc = new VideoCapture(filename)
    const [ sub, special ] = getSkills(await vc.readAsync())
    const result = await sub.cannyAsync(2, 20)
    imshow('fuck', special)
    waitKey()
}
main(process.argv.slice(2)).catch(err => console.error(err))
