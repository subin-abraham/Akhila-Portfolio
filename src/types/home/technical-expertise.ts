export interface TechnicalExpertiseSkill {
  id: string;
  name: string;
  proficiency: number;
  sortOrder: number;
}

export interface TechnicalExpertiseCategory {
  category: string;
  skills: TechnicalExpertiseSkill[];
}
