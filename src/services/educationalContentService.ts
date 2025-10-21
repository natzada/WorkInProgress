import { apiConfig } from './api';

export interface EducationalContent {
  id: number;
  title: string;
  url: string;
  category: string;
  description?: string;
}

export const educationalContentService = {
  async getAllContents(): Promise<EducationalContent[]> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/contents`);
      if (!response.ok) throw new Error('Failed to fetch educational contents');
      return await response.json();
    } catch (error) {
      console.error('Error fetching educational contents:', error);
      return [];
    }
  }
};