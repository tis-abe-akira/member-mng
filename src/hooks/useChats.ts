import { useState, useEffect } from 'react';
import { Chat, Message } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { createStorageAdapter } from '../storage/StorageAdapter';

const STORAGE_KEY = 'chats';
const MESSAGES_KEY = 'chat_messages';
const storageAdapter = createStorageAdapter();

// モックデータ用のサンプルメッセージ
const sampleMessages: Message[] = [
  {
    id: '1',
    senderId: 'current-user',
    receiverId: '2',
    content: 'こんにちは！',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: true,
  },
  {
    id: '2',
    senderId: '2',
    receiverId: 'current-user',
    content: 'やあ、元気？',
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    isRead: true,
  },
  {
    id: '3',
    senderId: 'current-user',
    receiverId: '2',
    content: 'うん、元気だよ！プロジェクトはどう進んでる？',
    timestamp: new Date(Date.now() - 2400000).toISOString(),
    isRead: true,
  },
  {
    id: '4',
    senderId: '2',
    receiverId: 'current-user',
    content: '順調だよ。ありがとう！',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    isRead: true,
  },
];

// モックデータ用のサンプルチャット
const sampleChats: Chat[] = [
  {
    id: '1',
    participants: ['current-user', '2'],
    lastMessage: sampleMessages[3],
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '2',
    participants: ['current-user', '3'],
    lastMessage: {
      id: '5',
      senderId: '3',
      receiverId: 'current-user',
      content: 'また連絡するね！',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      isRead: true,
    },
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [currentUserId] = useState('current-user'); // 実際のアプリでは認証システムから取得

  // 初期データの読み込み
  useEffect(() => {
    const loadChats = async () => {
      try {
        const storedChats = await storageAdapter.getItem<Chat[]>(STORAGE_KEY);
        const storedMessages = await storageAdapter.getItem<Record<string, Message[]>>(MESSAGES_KEY);
        
        if (storedChats) {
          setChats(storedChats);
        } else {
          // 初回のみサンプルデータを使用
          await storageAdapter.setItem(STORAGE_KEY, sampleChats);
          setChats(sampleChats);
        }

        if (storedMessages) {
          setMessages(storedMessages);
        } else {
          const initialMessages = { '1': sampleMessages };
          await storageAdapter.setItem(MESSAGES_KEY, initialMessages);
          setMessages(initialMessages);
        }
      } catch (error) {
        console.error('チャットデータの読み込みに失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, []);

  // チャットの選択
  const selectChat = async (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setSelectedChat(chat);
      // 未読メッセージを既読にする
      if (chat.id in messages) {
        const updatedMessages = messages[chat.id].map(msg => 
          msg.receiverId === currentUserId && !msg.isRead 
            ? { ...msg, isRead: true } 
            : msg
        );
        setMessages({
          ...messages,
          [chat.id]: updatedMessages
        });
      }
    }
  };

  // メッセージの送信
  const sendMessage = async (chatId: string, content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      senderId: currentUserId,
      receiverId: chats.find(c => c.id === chatId)?.participants.find(p => p !== currentUserId) || '',
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    try {
      // メッセージを追加
      const updatedMessages = {
        ...messages,
        [chatId]: [...(messages[chatId] || []), newMessage],
      };
      await storageAdapter.setItem(MESSAGES_KEY, updatedMessages);
      setMessages(updatedMessages);

      // チャットの最終メッセージを更新
      const updatedChats = chats.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              lastMessage: newMessage,
              updatedAt: newMessage.timestamp 
            } 
          : chat
      );
      await storageAdapter.setItem(STORAGE_KEY, updatedChats);
      setChats(updatedChats);
    } catch (error) {
      console.error('メッセージの送信に失敗しました:', error);
      throw error;
    }

    // 自動応答を生成（1秒後）
    setTimeout(() => {
      const autoResponses = [
        "了解しました！",
        "ありがとうございます！",
        "なるほど、わかりました。",
        "それは素晴らしいですね！",
        "もう少し詳しく教えていただけますか？",
        "承知しました。後ほど対応します。",
        "素敵なアイデアですね！",
        "ご連絡ありがとうございます。",
        "検討してみます！",
        "了解！また連絡します。"
      ];
      
      const randomResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];
      
      const responseMessage: Message = {
        id: uuidv4(),
        senderId: newMessage.receiverId,
        receiverId: currentUserId,
        content: randomResponse,
        timestamp: new Date().toISOString(),
        isRead: true,
      };
      
      // 応答メッセージを追加
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), responseMessage],
      }));
      
      // チャットの最終メッセージを更新
      setChats(prev => 
        prev.map(chat => 
          chat.id === chatId 
            ? { 
                ...chat, 
                lastMessage: responseMessage,
                updatedAt: responseMessage.timestamp 
              } 
            : chat
        )
      );
    }, 1000);

    return newMessage;
  };

  // 新しいチャットの作成
  const createChat = async (participantId: string) => {
    // 既存のチャットをチェック
    const existingChat = chats.find(chat => 
      chat.participants.includes(currentUserId) && 
      chat.participants.includes(participantId)
    );

    if (existingChat) {
      setSelectedChat(existingChat);
      return existingChat;
    }

    // 新しいチャットを作成
    const newChat: Chat = {
      id: uuidv4(),
      participants: [currentUserId, participantId],
      updatedAt: new Date().toISOString(),
    };

    try {
      const updatedChats = [...chats, newChat];
      await storageAdapter.setItem(STORAGE_KEY, updatedChats);
      setChats(updatedChats);
      setSelectedChat(newChat);

      const updatedMessages = {
        ...messages,
        [newChat.id]: []
      };
      await storageAdapter.setItem(MESSAGES_KEY, updatedMessages);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('チャットの作成に失敗しました:', error);
      throw error;
    }

    return newChat;
  };

  // チャットの削除
  const deleteChat = async (chatId: string) => {
    try {
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      await storageAdapter.setItem(STORAGE_KEY, updatedChats);
      setChats(updatedChats);

      const updatedMessages = { ...messages };
      delete updatedMessages[chatId];
      await storageAdapter.setItem(MESSAGES_KEY, updatedMessages);
      setMessages(updatedMessages);

      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error('チャットの削除に失敗しました:', error);
      throw error;
    }
  };

  // 特定のチャットのメッセージを取得
  const getChatMessages = (chatId: string) => {
    return messages[chatId] || [];
  };

  return {
    isLoading,
    chats,
    selectedChat,
    selectChat,
    sendMessage,
    createChat,
    deleteChat,
    getChatMessages,
    currentUserId,
  };
};
