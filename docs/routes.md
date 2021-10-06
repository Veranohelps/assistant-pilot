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

#### Notes

- As the globalId is an implementation detail for routes, it is omitted from all client API responses
