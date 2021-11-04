## API Endpoints

### Edit user first and second name

Update first name, second name or both.
\
\
`PATCH /personal/user/edit-profile`

#### Body Parameters

| field       | required  | description                                               |
| ------      |  -------- | --------------------------------------------------------- |
| firstName   | false     | User's first name                                 |
| secondName  | false     | User's second name |

#### Sample response
```
{
    "success": true,
    "message": "User profile edited success",
    "data": {
        "user": {
            "id": "o4CCSGiZhvoTWshLGraQiV",
            "auth0Id": "auth0|6148211cb5ceb0007196173e",
            "email": "email@dominiio.com",
            "firstName": "Raquel",
            "lastName": "Raquel",
            "otherName": null,
            "isRegistrationFinished": false,
            "isSubscribedToNewsletter": false,
            "avatar": "https://storage.googleapis.com/<bucket_name>/<file_name>",
            "createdAt": "2021-10-08T06:17:43.289Z",
            "updatedAt": "2021-10-29T16:48:17.309Z",
            "deletedAt": null
        }
    }
}
```

### Change avatar image

Upload a new image for the user's avatar. If there's a previous one it'll be deleted before updating.
\
\
`PATCH /personal/user/update-avatar`

#### Body Parameters

| field       | required  | description                                                                 |
| ------      | --------  | --------------------------------------------------------------------------  |
| file        | false      | form-encoded file with the avatar image, if no avatar then delete de image |

Image constrains:

 - JPG or PNG.
 - 512x512 pixels maximum size.
 - 1MB.

#### Sample response
```
{
    "success": true,
    "message": "Avatar updated success",
    "data": {
        "user": {
            "id": "o4CCSGiZhvoTWshLGraQiV",
            "auth0Id": "auth0|6148211cb5ceb0007196173e",
            "email": "email@dominiio.com",
            "firstName": "Raquel",
            "lastName": "Raquel",
            "otherName": null,
            "isRegistrationFinished": false,
            "isSubscribedToNewsletter": false,
            "avatar": "https://storage.googleapis.com/<bucket_name>/<file_name>",
            "createdAt": "2021-10-08T06:17:43.289Z",
            "updatedAt": "2021-10-29T16:48:17.309Z",
            "deletedAt": null
        }
    }
}
```

### Delete avatar image

Delete user's avatar, `avatar` will return `null` in following profile requests.
\
\
`DELETE /personal/user/delete-avatar`

#### Body Parameters

N/A

#### Sample response
```
{
    "success": true,
    "message": "Avatar deleted success",
    "data": {
        "user": {
            "id": "o4CCSGiZhvoTWshLGraQiV",
            "auth0Id": "auth0|6148211cb5ceb0007196173e",
            "email": "email@dominiio.com",
            "firstName": "Raquel",
            "lastName": "Raquel",
            "otherName": null,
            "isRegistrationFinished": false,
            "isSubscribedToNewsletter": false,
            "avatar": null,
            "createdAt": "2021-10-08T06:17:43.289Z",
            "updatedAt": "2021-10-29T16:48:17.309Z",
            "deletedAt": null
        }
    }
}
```
