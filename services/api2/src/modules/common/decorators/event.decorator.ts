import { OnEvent } from '@nestjs/event-emitter';
import { OnOptions } from 'eventemitter2';
import { IEventMappings } from '../types/event.type';

export function OnAppEvent(k: keyof IEventMappings, options?: OnOptions) {
  return OnEvent(k, options);
}
