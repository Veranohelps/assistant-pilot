import { IBaseResponse } from './request';
import { ISkill, ISkillCategory, ISkillLevel } from './skill';

export interface ISkillDictionary extends ISkillCategory {
  skills: (ISkill & {
    levels: ISkillLevel[];
  })[];
}

export interface IGetSkillDictionaryResponse extends IBaseResponse {
  data: {
    skills: ISkillDictionary[];
  };
}
