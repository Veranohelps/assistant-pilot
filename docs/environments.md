# Environments

Dersu services are accessible through different environments, each with a purpose and expectations. Currently:

- Production: stable and gets public traffic. 
- Develop: developer's playground, can break and go down at any time.

## How it works

Environments are created and managed using [Terraform Workspaces](https://www.terraform.io/docs/language/state/workspaces.html).

Each environment contains a full and isolated set of infrastructure resources requiered to run its services.

Environments are mapped to GIT branches of the same name. Through Github Actions each commit to `production` or `develop` branches is automatically deployed to its corresponding environment.

## Production releases

The `production` environment should never be ahead (have differences) with `develop`. The flow of work, including bug fixes, should be PR > `develop` > `production`.

To do a production release:

- Create a pull request from `develop` to `production` that includes all the latest changes.
- Sqash and merge into `production` in order to trigger the CD action.