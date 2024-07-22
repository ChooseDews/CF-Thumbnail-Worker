import { runtime } from "./svgRuntime";

const SVG_URL = 'https://svgshare.com/i/18Wf.svg'; //uploaded to url to save worker space
let SVG_DATA = false;

export default {
	async fetch(request, env, ctx) {
		if (!SVG_DATA) {
			SVG_DATA = await fetch(SVG_URL).then(res => res.text());
		}
		const url = new URL(request.url);
		const lat = parseFloat(url.searchParams.get('lat')) || 40.7128;
		const lng = parseFloat(url.searchParams.get('lng')) || -74.0060;
		const boxSize = parseFloat(url.searchParams.get('boxSize')) || 250;
		const radius = parseFloat(url.searchParams.get('radius')) || 6;
		const width = parseFloat(url.searchParams.get('width')) || 300;
		let pngBuffer = await runtime(SVG_DATA, lat, lng, boxSize, radius, width);
		return new Response(pngBuffer, {
			headers: {
				'Content-Type': 'image/png',
			}
		});
	},
};
