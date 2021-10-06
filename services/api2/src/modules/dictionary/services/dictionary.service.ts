import { Injectable } from '@nestjs/common';
import { generateGroupRecord } from '../../common/utilities/generate-record';
import { RouteOriginService } from '../../route/services/route-origin.service';
import { SkillCategoryService } from '../../skill/services/skill-category.service';
import { SkillLevelService } from '../../skill/services/skill-level.service';
import { SkillService } from '../../skill/services/skill.service';

@Injectable()
export class DictionaryService {
  constructor(
    private skillCategoryService: SkillCategoryService,
    private skillService: SkillService,
    private skillLevelService: SkillLevelService,
    private routeOriginService: RouteOriginService,
  ) {}

  async levels() {
    const [levels, skills, categories] = await Promise.all([
      this.skillLevelService.getAllLevels(),
      this.skillService.getAllSkills(),
      this.skillCategoryService.getCategories(),
    ]);
    const levelsGroupRecord = generateGroupRecord(levels, (l) => l.skillId);
    const skillsGroupRecord = generateGroupRecord(skills, (s) => s.categoryId);

    const dictionaryLevels = categories.map((c) => ({
      ...c,
      skills:
        skillsGroupRecord[c.id]?.map((s) => ({
          ...s,
          levels: levelsGroupRecord[s.id] ?? [],
        })) ?? [],
    }));

    return dictionaryLevels;
  }

  async routeOrigins() {
    const routeOrigins = await this.routeOriginService.getAllOrigins();

    return routeOrigins;
  }
}
