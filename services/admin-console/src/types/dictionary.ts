import { IBaseResponse } from './request';
import { ISkill, ISkillCategory, ISkillLevel } from './skill';

export interface IGetSkillDictionaryResponse extends IBaseResponse {
  data: {
    skills: (ISkillCategory & { skills: (ISkill & { levels: ISkillLevel[] })[] })[];
  };
}
