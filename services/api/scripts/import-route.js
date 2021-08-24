const { v4: uuidv4 } = require("uuid");
const from = process.argv[2];
const to = process.argv[3];

var tj = require("togeojson"),
  fs = require("fs"),
  // node doesn't have xml parsing or a dom. use xmldom
  DOMParser = require("xmldom").DOMParser;

const gpxDocument = new DOMParser().parseFromString(
  fs.readFileSync(from, "utf8")
);

const parsedDocument = tj.gpx(gpxDocument);

// console.log(JSON.stringify(parsedDocument, null, " "));

// process.exit(0);

console.log("About to run toGeoJSON");
console.log(`FROM: ${from}`);
// console.log(`TO: ${to}`);

const route = {};

const mainFeature = parsedDocument.features.find(
  (feature) => feature.geometry.type == "LineString"
);
const coordinates = mainFeature.geometry.coordinates;

route.name = mainFeature.properties.name;
route.coordinates = coordinates.map((coordinate) => {
  return {
    latitude: coordinate[1],
    longitude: coordinate[0],
    altitude: coordinate[2],
  };
});

const waypoints = [];
const pointFeatures = parsedDocument.features.filter(
  (feature) => feature.geometry.type == "Point"
);
pointFeatures.forEach((pointFeature) => {
  waypoints.push({
    id: uuidv4(),
    name: pointFeature.properties.name,
    description: pointFeature.properties.desc,
    type: "some-type",
    radius_in_meters: 100,
    latitude: pointFeature.geometry.coordinates[1],
    longitude: pointFeature.geometry.coordinates[0],
    altitude: pointFeature.geometry.coordinates[2],
  });
});

console.log(JSON.stringify(waypoints, null, " "));
