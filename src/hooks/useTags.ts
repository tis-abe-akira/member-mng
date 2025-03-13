import { useState } from 'react';
import { Tag } from '../types';

// サンプルデータ
const initialTags: Tag[] = [
  {
    id: '1',
    name: 'エンジニア',
    category: 'position',
    color: '#2196f3',
  },
  {
    id: '2',
    name: '写真',
    category: 'hobby',
    color: '#4caf50',
  },
  {
    id: '3',
    name: 'デザイナー',
    category: 'position',
    color: '#f44336',
  },
  {
    id: '4',
    name: 'アニメーション',
    category: 'hobby',
    color: '#9c27b0',
  },
];

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>(initialTags);

  const addTag = (tagData: Omit<Tag, 'id'>) => {
    const newTag: Tag = {
      id: Date.now().toString(),
      ...tagData,
    };
    setTags(prev => [...prev, newTag]);
  };

  const updateTag = (id: string, tagData: Omit<Tag, 'id'>) => {
    setTags(prev =>
      prev.map(tag =>
        tag.id === id
          ? { ...tag, ...tagData }
          : tag
      )
    );
  };

  const deleteTag = (id: string) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
  };

  const getTagsByCategory = (category: Tag['category']) => {
    return tags.filter(tag => tag.category === category);
  };

  return {
    tags,
    addTag,
    updateTag,
    deleteTag,
    getTagsByCategory,
  };
};
