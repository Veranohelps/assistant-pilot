import { Module } from '@nestjs/common';
import { SkillModule } from '../skill/skill.module';
import { PersonalDictionaryController } from './controllers/personal/personal.dictionary.controller';
import { PersonalSkillDictionaryController } from './controllers/personal/personal.skill.dictionary.controller';

@Module({
  imports: [SkillModule],
  controllers: [PersonalDictionaryController, PersonalSkillDictionaryController],
})
export class DictionaryModule {}
