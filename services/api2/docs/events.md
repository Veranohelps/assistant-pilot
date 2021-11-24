# Events

A simple observer implementation used to handle certain workflows in the app where handling it otherwise will lead to unwanted coupling of different parts of the application.

As an example, lets say a user's account was deleted, here's a small list of things we want to do:

- delete all uploaded routes
- delete all expeditions
- remove user from all groups
- finally, delete the user

This list is bound to grow as the app grows and a user get associated to more entities.

Without events, we would be forced to create explicit dependencies between the user module and any of the modules that would want to react to a user account being deleted which is far from ideal.

## Implementation

Events are implemented using nestjs's event emitter module, docs [here](https://docs.nestjs.com/techniques/events) based on the performant [eventEmitter2](https://github.com/EventEmitter2/EventEmitter2) library.

On the app side, an EventService is provided by the CommonModule exposing just 2 methods, "emit" and "emitAsync".

- emit - fire and forget, non blocking, just fire the event and keep moving
- emitAsync - fire and wait for all handlers to complete successfully before moving forward. This is especially important event subscribers will need to do some cleanup e.g. A delete event

For declaratively defining event listeners, nestjs provides an @OnEvent decorator to mark a method as an event listener, of course we provided a wrapper over the decorator @OnAppEvent which doesn't do much except strongly typing the event names.

## Usage Notes

Events are not meant to be the standard way to implement inter-service communication. It's best suited for situations where an action is expected to have app-wide and constantly evolving implications or side effects, deleting a user is one of such actions.
