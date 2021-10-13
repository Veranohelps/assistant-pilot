# Dashboard

Collection of modules to be displayed by client dashboard

## Models

### Module

A dashboard module consists of basically an ID and a data field that can take any form depending on the module

| field | type   | nullable | description              |
| ----- | ------ | -------- | ------------------------ |
| id    | string | false    | module unique identifier |
| data  | any    | false    | modules data             |

## Module types

### Upcoming Expedition Module

| field | type         | description                                          |
| ----- | ------------ | ---------------------------------------------------- |
| id    | string       | has a fixed value of `upcomingExpedition`            |
| data  | Expedition[] | An array of upcoming expeditions (see expedition.md) |

## API Endpoints

### Get dashboard modules

`GET /personal/dashboard`

#### Sample response

```
{
    "modules": [
        {
            "id": "upcomingExpedition",
            "data": [
                {
                    "id": "6KzKlWMR5eoFF2CoH0LdqK",
                    "userId": null,
                    "name": "New Task 3",
                    "description": "description",
                    "coordinate": {
                        "type": "Point",
                        "coordinates": [
                            22,
                            33,
                            33
                        ]
                    },
                    "startDateTime": "2021-10-07T09:40:00.000Z",
                    "updatedAt": "2021-10-05T09:42:57.927Z",
                    "url": "http://localhost:3033/personal/expedition/6KzKlWMR5eoFF2CoH0LdqK"
                }
            ]
        }
    ]
}
```
