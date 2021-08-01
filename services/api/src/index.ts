import cors from "cors";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import routeUrl from "./utils";

const PORT = Number(process.env.PORT) || 3000;
const app = express();

interface Route {
  id: string;
  url: string;
}

interface Expedition {
  routes: Array<Route>;
}

interface Location {
  latitude: number;
  longitude: number;
  altitude: number;
}

interface Geometry {
  coordinates: Array<Array<number>>;
}

interface Feature {
  geometry: Geometry;
}

app.use(helmet());
app.use(cors());
app.get("/", (req, res) => {
  const data = fs.readFileSync("./static/expeditions.json", "utf-8");
  const response = JSON.parse(data);
  const expeditions = response.expeditions as Array<Expedition>;
  expeditions.map((expedition) => {
    const { routes } = expedition;
    if (routes != null) {
      routes.map((route) => {
        // eslint-disable-next-line
        route.url = routeUrl(req, PORT, route.id);
        return route;
      });
    }
    return expedition;
  });

  res.json(response);
});

app.get("/routes/:id", (req, res) => {
  const geoJson = JSON.parse(
    fs.readFileSync(`./static/${req.params.id}.geojson`, "utf-8")
  );

  let coordinates: Array<Location> = [];

  // eslint-disable-next-line array-callback-return
  geoJson.features.map((feature: Feature) => {
    const jsonCoordinates = feature.geometry.coordinates as Array<
      Array<number>
    >;
    coordinates = coordinates.concat(
      jsonCoordinates.map(
        (coordinate) =>
          ({
            latitude: coordinate[1],
            longitude: coordinate[0],
            altitude: coordinate[2],
          } as Location)
      )
    );
  });

  coordinates = coordinates.filter(
    (location: Location) =>
      location.altitude != null && location.longitude != null
  );

  res.json({
    name: geoJson.features[0].properties.name,
    coordinates,
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
