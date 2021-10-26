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
| dateTime   | false    | start date in UTC format for the prediction to start from (ISO 8601), default: current UTC time     |

#### Sample response

Array of days each with an array of "weather points of interest", with forecast by the hour. 

At least one point of interest / range is guaranteed. This is typically the starting point of the route.

Note that ranges may be negative `[-999-0]` since there are routes with points below sea level. 

Pictocodes as per [Meteoblue documentation](https://content.meteoblue.com/en/specifications/standards/symbols-and-pictograms) (downloadeable set). Note that in order to use the day or night version of the pictocode you have to take `isDay` into account. 

Meteograms for the next 5 days from the current day. For predictions over five days, meteograms aren't provided for now. More information about Meteograms at [Meteoblue Forecast images](https://docs.meteoblue.com/en/weather-apis/images-api/forecast-images).

All calls to Meteoblue are signed and timestamped with a 3 months expiry date as described in [Signing API calls](https://docs.meteoblue.com/en/weather-apis/introduction/overview#signing-api-calls).

```
[
    {
        "dateTime": "2021-10-18T00:00:00.000Z",
        "sunriseDateTime": "2021-10-18T06:28:00.000Z",
        "sunsetDateTime": "2021-10-18T17:33:00.000Z",
        "ranges": [
            {
                "range": "1000-1999",
                "meteogram": "https://my.meteoblue.com/visimage/meteogram_web?lat=42.93277&lon=-0.834385&asl=1057.192",
                "forecastHourly": [
                    {
                        "dateTime": "2021-10-18T21:00:00.000Z",
                        "temperature": 11.18,
                        "feltTemperature": 8.91,
                        "precipitation": 0,
                        "precipitationProbability": 0,
                        "visibility": 11850,
                        "lowClouds": 0,
                        "midClouds": 0,
                        "hiClouds": 100,
                        "totalCloudCover": 30,
                        "sunshineTime": 0,
                        "windSpeed": 2.73,
                        "windGust": 4.68,
                        "isDay": 0,
                        "pictoCode": 2
                    },
                    ...
                ]
            },
            ...
        ]
    },
    ...
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
