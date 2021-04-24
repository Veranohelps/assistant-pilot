import cors from "cors";
import express from "express";
import fs from "fs";

const PORT = process.env.PORT || 3000;
const app = express();

interface Route {
  id: string;
  url: string;
}

interface Expedition {
  routes: Array<Route>;
}

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
        route.url = `${req.protocol}://${req.hostname}:${PORT}/routes/${route.id}`;
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
  const jsonCoordinates = geoJson.features[0].geometry.coordinates as Array<
    Array<number>
  >;

  // NOTE (JD): WATCH OUT, geoJson file returns longitude first!!
  const coordinates = jsonCoordinates.map((coordinate) => ({
    latitude: coordinate[1],
    longitude: coordinate[0],
    altitude: coordinate[2],
  }));

  res.json({
    name: geoJson.features[0].properties.name,
    coordinates,
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
