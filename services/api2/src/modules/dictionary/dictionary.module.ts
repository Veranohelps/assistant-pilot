import { Module } from '@nestjs/common';
import { RouteModule } from '../route/route.module';
import { SkillModule } from '../skill/skill.module';
import { WaypointModule } from '../waypoint/waypoint.module';
import { PersonalDictionaryController } from './controllers/personal/personal.dictionary.controller';
import { DictionaryService } from './services/dictionary.service';

@Module({
  imports: [SkillModule, RouteModule, WaypointModule],
  controllers: [PersonalDictionaryController],
  providers: [DictionaryService],
})
export class DictionaryModule {}
