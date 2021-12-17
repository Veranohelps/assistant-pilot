# Activities

Data models and endpoints related to activity reporting.

## Models

### ExpeditonStatus

Status in which an expedition can be. Possible status are:
- PLANNING: the expedition has been created and planned for an specific time.
- IN-PROGRESS: the expedition has started.
- FINISHED: the expedition has ended.
- CANCELLED: the expedition has been cancelled.

### ExpeditionEventType
Types of events. In this moment we have start, finish, location, network, ping and error.

field|type|nullable|description
-|-|-|-
id|string|false|ExpeditionEventType's id
name|string|false|Name of the expeditionEventType
description|true|Description

#### NOTE: 
The ExpeditionEventType data model is
```
{
    type: location | network | ping | error;
    dateTime: Date;
    JSON with event information(*)
}
```
(*)Where JSON can be:
```
  If the event type is start, finish, location or ping. For event types start, finish and ping, coordinates are optional.
  {
      coordinates: [lon, lat, alt]
  }
  If the event type is network:
  {
      network: true | false,
      coordinates?: [lon, lat, alt] (*)Coordinates are optional
  }
  If the envent type is error:
  {
      message: errormesagge
  }
```
### ExpeditionEvent

field|type|nullable|description
-|-|-|-
id|string|false|state's unique identificator
expeditionId|string|false|expedition id
userId|string|false|references the user id
type|string|false|string with ExpeditionEventType's id
dateTime|date|false|dateTime in which the event occur
meta|json|true|json with the information associated with the event


### EpeditionLog

Logs the different states an expedition passes through.

field|type|nullable|description
-|-|-|-
id|string|false|expeditionLog's unique identifier
expeditionId|string|false|expedition's id
actualRouteId|string|false|id of the effective route
originId|string|false|origin of the expedition: Dersu, strava, garmin, manual
visibility|string|false|Now we are considering only private
averageSpeed|float|true|Average speed
startDateTime|date|false|Start date
endDateTime|date|false|End date


## Endpoints
`GET  /personal/expedition/user/log`
\
Gets all the expeditions for a user (list of all user activities)

`GET  /personal/expedition/user/log/:expeditionLogId`
\
Gets the expedition log by id with the associated route

\
Gets the expedition log (equivalent to the concept of activity in strava)

`PATCH /personal/expedition/:expeditionId/user/start`
\
Starts an expedition. Mark the expeditionStatus IN-PROGRESS. Insert an event of type expedition in the ExpeditionEvent table. This event could have coordinates.

#### Route Parameters

| field        | description          |
| ----------   | -------------------- |
| expeditionId | id of the expedition |

#### Body Parameter

An event of type start. Example:
```
{
    "type": "start",
    "dateTime": "2021-12-08T09:16:46.407Z",
    "coordinates": [ -0.075185, 42.278548, 752.313354492 ]    
}
```
`POST /personal/expedition/:expeditionId/user/ping`
\
Insert a event of type ping. This event could have coordinates.

#### Route Parameters

| field        | description          |
| ----------   | -------------------- |
| expeditionId | id of the expedition |

#### Body Parameter

An event of type ping. Example:
```
{
    "type": "ping",
    "dateTime": "2021-12-08T09:16:46.407Z",
    "coordinates": [ -0.075185, 42.278548, 752.313354492 ]   (*)Optional!! 
}
```

`POST /personal/expedition/:expeditionId/finish`
\
 Mark the expeditionStatus FINISHED. This endpoint receives an array of ExpeditionEvents. The expedition events can be of any type. The last event is of type 'finish'. This finish event could have coordinates. At least an expedition event of type finish should be provided. Example:
 ```
 { data: 
   [
        {
            "type": "location",
            "dateTime": "2021-12-08T09:16:46.407Z",
            "coordinates": [ -0.075185, 42.278548, 752.313354492 ]    
        },
        {
            "type": "netwok",
            "dateTime": "2021-12-08T09:16:46.407Z",
            "network": true
        },
        {
            "type": "location",
            "dateTime": "2021-12-08T09:26:46.407Z",
            "coordinates": [ -0.069609, 42.292167, 859.815 ]    
        }
        ...
        {
            "type": "finish",
            "dateTime": "2021-12-08T09:36:46.407Z",
            "coordinates": [ -0.069609, 42.292167, 859.815 ]  (*)Optional!!!  
        }
    ]
 }
```
`PATCH /personal/expedition/:expeditionId/cancel`
\
Expedition can be cancelled only by the owner and this endpoint change expeditionStatus to CANCELLED for all the rows with this expeditionId.


This endpoints haven't implemented yet:
### Get user activities from strava
`/personal/activity/strava/`
Returns the activities of a user for a specific access token from strava. Requires activity:read. Only Me activities will be filtered out unless requested by a token with activity:read_all.

### Get user activity from strava
`/personal/activity/strava/:id`
Imports an activity from strava. The activity must be owned by the authenticated athlete with the token from strava. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.

