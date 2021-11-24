import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IEventMappings } from '../types/event.type';

@Injectable()
export class EventService {
  constructor(private eventEmitter: EventEmitter2) {}

  emit<E extends keyof IEventMappings>(event: E, payload: IEventMappings[E]) {
    this.eventEmitter.emit(event, payload);
  }

  async emitAsync<E extends keyof IEventMappings>(event: E, payload: IEventMappings[E]) {
    return this.eventEmitter.emitAsync(event, payload);
  }
}
