import cors from "cors";
import express from "express";

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
// @ts-expect-error: not using `req` for now, remove later
app.get("/", (req, res) => {
  res.json({
    expeditions: [
      {
        name: "Montblanc Summer",
        location: {
          latitude: "45.8326364",
          longitude: "6.860776",
        },
      },
      {
        name: "Monte Perdido",
        location: {
          latitude: "42.6526163",
          longitude: "-0.0110755",
        },
      },
    ],
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
