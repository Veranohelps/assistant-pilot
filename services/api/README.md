# API How to

1. Download GPX file
1. Run `npx @tmcw/togeojson-cli /path/of/gpx > /path/to/file.geojson` to output geoJson file that goes into `static` folder.
1. Run `npm run gpx-to-geojson /path/of/gpx` to extract waypoints that go into `expeditions.json`.
1. Update `expeditions.json` to add the new expedition, use route geoJson file name as the ID.
