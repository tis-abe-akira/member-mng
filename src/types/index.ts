export interface Tag {
  id: string;
  name: string;
  category: 'position' | 'hobby' | 'other';
  color?: string;
}

export interface Member {
  id: string;
  name: string;
  imageUrl: string;
  introduction: string;
  tags: Tag[];
  isEditable: boolean;
  createdAt: string;
}

export interface MemberFormData {
  name: string;
  imageUrl: string;
  introduction: string;
  tags: Tag[];
  imageData?: string; // Base64形式の画像データ（オプショナル）
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  participants: string[]; // メンバーIDの配列
  lastMessage?: Message;
  updatedAt: string;
}
