import { Controller, Get, HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { JwtProtected } from '../../../auth/decorators/jwt-protected.decorator';
import { generateGroupRecord } from '../../../common/utilities/generate-record';
import { successResponse } from '../../../common/utilities/success-response';
import { SkillCategoryService } from '../../../skill/services/skill-category.service';
import { SkillLevelService } from '../../../skill/services/skill-level.service';
import { SkillService } from '../../../skill/services/skill.service';

@Controller('/personal/dictionary/skill')
@JwtProtected()
@Injectable()
export class PersonalSkillDictionaryController {
  constructor(
    private skillCategoryService: SkillCategoryService,
    private skillService: SkillService,
    private skillLevelService: SkillLevelService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getPersonalDictionaryLevels() {
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

    return successResponse('Personal Skill Dictionary', { dictionaryLevels });
  }
}
