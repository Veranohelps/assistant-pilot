# Route

## Models

### Route

A route at its core is just a LineString (a set of point coordinates) with associated data.
field|type|nullable|description
-|-|-|-
id|string|false|route's unique identifier
name|string|false|route's name
originId|string|false|id of the route's origin. Currently, possible origins are dersu, garmin, strava and manual
globalId|string|false|this ID will be associated with this route across copies or duplication i.e duplicating a route will create a route with a different id but the same globalId
ownerId|string|true|ID of the user that created this route, this field would be null for routes from non-user origins e.g. dersu
coordinate|geometry|false|actual coordinates for this route returned as GeoJSON

### RouteOrigin

Route origins are sources for Routes on Dersu. As at the time of writing this, possible route origins are:

- Dersu (Routes provided and curated by Dersu)
- Strava
- Garmin
- Manual (Routes uploaded by users via gpx files)

| field | type   | nullable | description                |
| ----- | ------ | -------- | -------------------------- |
| id    | string | false    | origin's unique identifier |
| name  | string | false    | origin's name              |

## API Endpoints

### Get routes for a user

This should return all routes created by a user and also publicly available routes
\
\
`/personal/route`

#### URL Parameters

| field  | required | description                                               |
| ------ | -------- | --------------------------------------------------------- |
| area   | false    | area to search for routes                                 |
| level  | false    | get routes with waypoints associated with a certain level |
| origin | false    | id or the route origin                                    |
| owner  | false    | filter by route owner                                     |

#### Sample response

```
{
  "data": {
    "routes": [
      {
        "id": "routeId",
        "name": "route1",
        "originId": "originId",
        "userId": "userId",
        "url": "https://dersu-api/personal/routes/routeId"
      }
    ]
  }
}
```

`/personal/route/:routeId`
Get all details of a route including its coordinate data

#### Route Parameters

| field   | description     |
| ------- | --------------- |
| routeId | id of the route |

#### Sample response

```
{
  "data": {
    "route": {
        "id": "routeId",
        "name": "route1",
        "originId": "originId",
        "userId": "userId",
        "coordinate": {
            "feature": "LineString",
            "coordinates": [
                [1, 2, 3],
                [4, 5, 6]
            ]
        }
    }
  }
}
```

`/personal/dictionary/route-origin`
Returns all possible Dersu route origins

#### Sample response

```
{
  "data": {
    "routes": [
      {
        "id": "originId",
        "name": "dersu"
      },
      {
        "id": "originId",
        "name": "strava"
      },
      {
        "id": "originId",
        "name": "garmin"
      },
      {
        "id": "originId",
        "name": "manual"
      }
    ]
  }
}
```

### Get weather prediction for a route

This should return weather prediction for a routeId
\
\
`/personal/route/:routeId/weather`

#### Route Parameters

| field   | description     |
| ------- | --------------- |
| routeId | id of the route |

#### URL Parameters

| field      | required | description                                                                       |
| ---------- | -------- | --------------------------------------------------------------------------------- |
| dateTime   | false    | start date for the prediction in UTC format (ISO 8601), default: current time     |

#### Sample response

- Array of "weather points of interest" in the form of altitude ranges. At least one guaranteed.
- `forcast` is an array of weather data by date time. Amount returned TBD.

```
[
    {
        "range": "0-999",
        "sunriseDateTime": "2021-10-11T08:03:00.000000",
        "sunsetDateTime": "2021-10-11T19:24:00.000000",
        "forecast":
        [
            {
                "dateTime": "2021-10-11T00:00:00.000000",
                "temperature": 13.32,
                "feltTemperature": 10.21,
                "precipitation": 0.00,
                "precipitationProbability": 0,
                "visibility": 17450,
                "lowClouds": 0,
                "midClouds": 0,
                "hiClouds": 10,
                "totalCloudCover": 3,
                "sunshineTime": 0,
                "windSpeed": 2.69,
                "windGust": 4.08,
                "isDay": 0,
                "pictoCode": 5
            }
        ]
    }
]
```


#### Notes

- As the globalId is an implementation detail for routes, it is omitted from all client API responses
- Units for the predicion variables:
  
  ```
        "temperature": "C",
        "precipitation": "mm",
        "precipitationProbability": "percent",
        "visibility": "m",
        "cloudCover": "percent",
        "sunshineTime": "minutes"
        "windSpeed": "ms-1",
        "windGust": "ms-1",
        "isDay": "0-night, 1-day",
        "pictoCode": "1-35 codes, differents for night/day, i.e. 1 for isDay=0 is a different image than 1 for isDay=1"
  ```
- As we are using Meteoblue API, for forecast days 8 – 14, you get trend data. 1h data is for technical simplification only, there is no skill in 1h 14 day forecasts.
