import { useState } from 'react';
import { Member, MemberFormData } from '../types';

// サンプルデータ
const initialMembers: Member[] = [
  {
    id: '1',
    name: '山田太郎',
    imageUrl: 'https://source.unsplash.com/random/200x200?face-1',
    introduction: 'フロントエンドエンジニアとして働いています。React/TypeScriptが得意です。趣味は写真撮影で、休日はカメラを持って街歩きをしています。',
    tags: [
      { id: '1', name: 'エンジニア', category: 'position', color: '#2196f3' },
      { id: '2', name: '写真', category: 'hobby', color: '#4caf50' }
    ],
    isEditable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: '鈴木花子',
    imageUrl: 'https://source.unsplash.com/random/200x200?face-2',
    introduction: 'UIデザイナーです。ユーザー体験を大切にしたデザインを心がけています。最近はアニメーション制作にも興味があります。',
    tags: [
      { id: '3', name: 'デザイナー', category: 'position', color: '#f44336' },
      { id: '4', name: 'アニメーション', category: 'hobby', color: '#9c27b0' }
    ],
    isEditable: true,
    createdAt: new Date().toISOString()
  }
];

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const addMember = (memberData: MemberFormData) => {
    const newMember: Member = {
      id: Date.now().toString(),
      ...memberData,
      // imageDataが存在する場合はそれを使用、そうでない場合はimageUrlを使用
      imageUrl: memberData.imageData || memberData.imageUrl,
      isEditable: true,
      createdAt: new Date().toISOString()
    };
    setMembers(prev => [...prev, newMember]);
    return newMember; // 追加したメンバー情報を返す
  };

  const updateMember = (id: string, memberData: MemberFormData) => {
    setMembers(prev =>
      prev.map(member =>
        member.id === id
          ? {
              ...member,
              ...memberData,
              // imageDataが存在する場合はそれを使用、そうでない場合はimageUrlを使用
              imageUrl: memberData.imageData || memberData.imageUrl,
            }
          : member
      )
    );
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  const reorderMembers = (startIndex: number, endIndex: number) => {
    const result = Array.from(members);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setMembers(result);
  };

  return {
    members,
    selectedMember,
    setSelectedMember,
    addMember,
    updateMember,
    deleteMember,
    reorderMembers
  };
};
