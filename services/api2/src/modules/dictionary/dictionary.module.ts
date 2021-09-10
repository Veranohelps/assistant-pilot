import { Module } from '@nestjs/common';
import { PersonalDictionaryController } from './controllers/personal.dictionary.controller';

@Module({
    controllers: [PersonalDictionaryController]
})
export class DictionaryModule {}
