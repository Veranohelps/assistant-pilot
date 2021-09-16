import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SkillCategoryService } from './services/skill-category.service';
import { SkillLevelService } from './services/skill-level.service';
import { SkillService } from './services/skill.service';

@Module({
  imports: [DatabaseModule.forFeature(['SkillCategory', 'Skill', 'SkillLevel'])],
  providers: [SkillCategoryService, SkillLevelService, SkillService],
  exports: [SkillCategoryService, SkillLevelService, SkillService],
})
export class SkillModule {}
