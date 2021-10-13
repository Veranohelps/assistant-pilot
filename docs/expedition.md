# Route

## Models

### Expedition

| field         | type     | nullable | description                          |
| ------------- | -------- | -------- | ------------------------------------ |
| id            | string   | false    | expedition's unique identifier       |
| name          | string   | false    | expedition's name                    |
| description   | string   | false    | expeditions's short description      |
| coordinate    | string   | false    | actual coordinates of the expedition |
| startDateTime | dateTime | false    | when this expedition starts          |

### ExpeditionRoute

This model defines the relationship between expeditions and routes (expeditions and routes have a many-many relationship).

| field         | type   | nullable | description                          |
| ------------- | ------ | -------- | ------------------------------------ |
| expeditionId  | string | false    | id of expedition                     |
| routeId       | string | false    | id of route                          |
| startDateTime | string | false    | start time for this particular route |

## API Endpoints

### Create expeditions

creates an expedition
\
\
`POST /personal/expedition/create`

#### Request payload

| field         | type               | required | description                                            |
| ------------- | ------------------ | -------- | ------------------------------------------------------ |
| routes        | expedition-route[] | true     | an array of routeIds                                   |
| name          | string             | true     | name of the expedition                                 |
| description   | string             | false    | optional short description for the route               |
| startDateTime | dateTime           | true     | when the expedition starts                             |


expedition-route
| field | type | required | description |
| ------------- | -------- | -------- | -------------------------- |
| routeId | string | true | routeId |
| startDateTime | dateTime | true | when the expedition starts |

#### Sample request payload

```
{
    "routes": [
        {
            "routeId": "routeId",
            "startDateTime": "2021-10-07T16:19:17.281Z"
        }
    ],
    "name": "Expedition",
    "description": "This is my first expedition, join at your own risk"
}
```

#### Sample response

```
{
  "data": {
    "expedition": {
      "id": "expeditionId",
      "name": "Expedition",
      "description": "This is my first expedition, join at your own risk",
      "startDateTime": "2021-10-07T16:19:17.281Z"
      "url": "https://dersu-api/personal/expedition/expeditionId"
    }
  }
}
```

### Get expedition by ID

`/personal/expedition/:expeditionId`

Get all details of an expedition including it's routes and their full coordinate data

#### Request Parameters

| field        | description          |
| ------------ | -------------------- |
| expeditionId | id of the expedition |

#### Sample response

```
{
  "data": {
    "expedition": {
        "id": "expeditionId",
        "name": "Expedition",
        "description": "This is my first expedition, join at your own risk",
        "startDateTime": "2021-10-07T16:19:17.281Z"
        "routes": [
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
        ]
    }
  }
}
```

#### Notes

- The coordinates of an expedition are not provided by the user making the request, rather they would be inferred using the starting point of the first route in the expedition
