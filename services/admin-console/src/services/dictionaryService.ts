import { apiBaseUrl } from '../config/environment';
import { IGetSkillDictionaryResponse } from '../types/dictionary';
import { http } from './httpService';

const dictionaryHttp = http.extend({ prefixUrl: `${apiBaseUrl}/admin/dictionary` });

export const getSkillDictionary = async () => {
  const response = await dictionaryHttp.get('skill').json<IGetSkillDictionaryResponse>();

  return response;
};
