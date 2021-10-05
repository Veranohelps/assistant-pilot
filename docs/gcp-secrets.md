# Sensitive configuration

Sensitve information is securely stored in GCP's Secret Manager.

Each major service part of Dersu has its own configuration, some of which has to be in sync (such as Auth0's). Configuration is also stored by environment. For example, to retrieve the application's configuration for `develop`:

```
gcloud secrets versions access 3 --secret="develop-app-configuration"
```

To create a new version of the configuration:

```
gcloud secrets versions add "develop-app-configuration" --data-file=new-configuration.env
```

When retrieving configuration / secrets always specific the version you want to retrive. 

## More information
- [Creating and accessing secrets](https://cloud.google.com/secret-manager/docs/creating-and-accessing-secrets).