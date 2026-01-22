import { Section, Template, TemplateCategory } from '../types';
import { businessTemplates } from './templates/business';
import { creativeTemplates } from './templates/creative';
import { eventTemplates } from './templates/event';
import { personalTemplates } from './templates/personal';

// 카테고리 목록
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: 'business', name: '비즈니스', description: '회사, 제품, 서비스 소개' },
  { id: 'creative', name: '크리에이티브', description: '포트폴리오, 작품 전시' },
  { id: 'event', name: '이벤트', description: '행사, 초대장, 모임' },
  { id: 'personal', name: '개인', description: '스토리, 일기, 자기소개' },
];

// ID 생성 헬퍼
const generateId = () => Math.random().toString(36).substr(2, 9);

// 템플릿을 실제 섹션으로 변환
export const applyTemplate = (template: Template): Section[] => {
  return template.sections.map(section => ({
    ...section,
    id: generateId(),
  }));
};

export const TEMPLATES: Template[] = [
  ...businessTemplates,
  ...creativeTemplates,
  ...eventTemplates,
  ...personalTemplates,
];
