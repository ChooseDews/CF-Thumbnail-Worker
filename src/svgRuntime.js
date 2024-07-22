

import { Resvg, initWasm } from '@resvg/resvg-wasm'
import WASM_DATA from '@resvg/resvg-wasm/index_bg.wasm';
await initWasm(WASM_DATA)

const millerProjection = (lat, lng) => {
    function toRadian(value) {
        return value * Math.PI / 180;
    }
    lng = toRadian(lng);
    lat = toRadian(lat);
    var x = lng;
    var y = 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * (lat)));
    return [x, y];
}


const runtime = function (svg_string, lat, lng, boxSize = 250, radius = 6, imageWidth = 300) {
    let resvg = new Resvg(svg_string, {})
    const width = resvg.width;
    const height = resvg.height;
    const scale = width / Math.PI / 2;

    const toPixel = (lat, lng) => {
        const coords = millerProjection(lat, lng);
        let xFudgeFactor = -55 //image used is offset by ~55 pixels
        return [width / 2 + coords[0] * scale + xFudgeFactor, height / 2 - coords[1] * scale];
    }    
    const loc = toPixel(lat, lng);
    let circle = `<circle cx="${loc[0]}" cy="${loc[1]}" r="${radius}" fill="#B43F3F" />`
    let mod_svg = svg_string.replace('</svg>', circle + '</svg>');
    if(imageWidth > 1000) imageWidth = 1000
    const opts = {
        fitTo: {
            mode: 'width',
            value: imageWidth,
        }
    }
    resvg = new Resvg(mod_svg, opts)
    let bondingBox = resvg.getBBox();
    bondingBox.x = loc[0] - boxSize / 2;
    bondingBox.y = loc[1] - boxSize / 2;
    bondingBox.width = boxSize;
    bondingBox.height = boxSize;
    resvg.cropByBBox(bondingBox);
    const pngData = resvg.render()
    const pngBuffer = pngData.asPng()
    return pngBuffer;
}


export {
    runtime
}