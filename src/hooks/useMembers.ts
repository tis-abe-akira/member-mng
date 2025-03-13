import { useState, useEffect } from 'react';
import { Member, MemberFormData } from '../types';
import { createStorageAdapter } from '../storage/StorageAdapter';

const STORAGE_KEY = 'members';
const storageAdapter = createStorageAdapter();

// サンプルデータ - 初回のみ使用
const initialMembersData: Member[] = [
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
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初期データの読み込み
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const storedMembers = await storageAdapter.getItem<Member[]>(STORAGE_KEY);
        if (storedMembers) {
          setMembers(storedMembers);
        } else {
          // 初回のみサンプルデータを使用
          await storageAdapter.setItem(STORAGE_KEY, initialMembersData);
          setMembers(initialMembersData);
        }
      } catch (error) {
        console.error('メンバーデータの読み込みに失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, []);

  // メンバー追加
  const addMember = async (memberData: MemberFormData) => {
    const newMember: Member = {
      id: Date.now().toString(),
      ...memberData,
      imageUrl: memberData.imageData || memberData.imageUrl,
      isEditable: true,
      createdAt: new Date().toISOString()
    };

    try {
      const updatedMembers = [...members, newMember];
      await storageAdapter.setItem(STORAGE_KEY, updatedMembers);
      setMembers(updatedMembers);
      return newMember;
    } catch (error) {
      console.error('メンバーの追加に失敗しました:', error);
      throw error;
    }
  };

  // メンバー更新
  const updateMember = async (id: string, memberData: MemberFormData) => {
    try {
      const updatedMembers = members.map(member =>
        member.id === id
          ? {
              ...member,
              ...memberData,
              imageUrl: memberData.imageData || memberData.imageUrl,
            }
          : member
      );
      await storageAdapter.setItem(STORAGE_KEY, updatedMembers);
      setMembers(updatedMembers);
    } catch (error) {
      console.error('メンバーの更新に失敗しました:', error);
      throw error;
    }
  };

  // メンバー削除
  const deleteMember = async (id: string) => {
    try {
      const updatedMembers = members.filter(member => member.id !== id);
      await storageAdapter.setItem(STORAGE_KEY, updatedMembers);
      setMembers(updatedMembers);
    } catch (error) {
      console.error('メンバーの削除に失敗しました:', error);
      throw error;
    }
  };

  // メンバー並び替え
  const reorderMembers = async (startIndex: number, endIndex: number) => {
    try {
      const result = Array.from(members);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      await storageAdapter.setItem(STORAGE_KEY, result);
      setMembers(result);
    } catch (error) {
      console.error('メンバーの並び替えに失敗しました:', error);
      throw error;
    }
  };

  return {
    members,
    selectedMember,
    setSelectedMember,
    addMember,
    updateMember,
    deleteMember,
    reorderMembers,
    isLoading
  };
};
