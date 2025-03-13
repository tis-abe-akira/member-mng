import { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, AppBar, Toolbar, IconButton, Avatar, Divider, styled } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ChatList } from './ChatList';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Member, Chat, Message } from '../../types';

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const ChatListContainer = styled(Paper)(({ theme }) => ({
  width: 320,
  height: '100%',
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const ChatAreaContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const ChatAreaContainerMobile = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: theme.zIndex.drawer + 1,
  display: 'flex',
  flexDirection: 'column',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

const NoSelectionContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.secondary,
}));

interface ChatPageProps {
  members: Member[];
  chats: Chat[];
  selectedChat: Chat | null;
  selectChat: (chatId: string) => void;
  sendMessage: (chatId: string, content: string) => Message;
  createChat: (participantId: string) => Chat;
  deleteChat: (chatId: string) => void;
  getChatMessages: (chatId: string) => Message[];
  currentUserId: string;
}

export const ChatPage = ({
  members,
  chats,
  selectedChat,
  selectChat,
  sendMessage,
  getChatMessages,
  currentUserId
}: ChatPageProps) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // レスポンシブ対応
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 960);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // チャット選択時の処理
  const handleChatSelect = (chatId: string) => {
    selectChat(chatId);
    if (isMobileView) {
      setShowMobileChat(true);
    }
  };

  // メッセージ送信時の処理
  const handleSendMessage = (content: string) => {
    if (selectedChat) {
      sendMessage(selectedChat.id, content);
    }
  };

  // モバイルビューでチャットを閉じる
  const handleCloseMobileChat = () => {
    setShowMobileChat(false);
  };

  // メッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat, getChatMessages]);

  // チャットの相手を取得
  const getChatPartner = (memberId: string): Member | undefined => {
    return members.find(member => member.id === memberId);
  };

  // 選択されたチャットのメッセージを取得
  const currentMessages = selectedChat ? getChatMessages(selectedChat.id) : [];
  
  // 選択されたチャットの相手を取得
  const chatPartner = selectedChat 
    ? getChatPartner(selectedChat.participants.find(id => id !== currentUserId) || '')
    : undefined;

  // チャットエリアのレンダリング
  const renderChatArea = () => (
    <>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          {isMobileView && (
            <IconButton edge="start" color="inherit" onClick={handleCloseMobileChat} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          {chatPartner && (
            <>
              <Avatar src={chatPartner.imageUrl} alt={chatPartner.name} sx={{ mr: 2 }}>
                {chatPartner.name.charAt(0)}
              </Avatar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {chatPartner.name}
              </Typography>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Divider />
      
      <MessagesContainer>
        {currentMessages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.senderId === currentUserId}
            showSenderName={true}
            senderName={
              message.senderId === currentUserId 
                ? 'あなた' 
                : getChatPartner(message.senderId)?.name
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        disabled={!selectedChat}
      />
    </>
  );

  return (
    <ChatContainer>
      <ChatListContainer elevation={0}>
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              チャット
            </Typography>
          </Toolbar>
        </AppBar>
        <Divider />
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <ChatList
            chats={chats}
            members={members}
            selectedChatId={selectedChat?.id || null}
            onChatSelect={handleChatSelect}
            currentUserId={currentUserId}
          />
        </Box>
      </ChatListContainer>

      {/* デスクトップビュー */}
      <ChatAreaContainer>
        {selectedChat ? (
          renderChatArea()
        ) : (
          <NoSelectionContainer>
            <Typography variant="h6" gutterBottom>
              チャットを選択してください
            </Typography>
            <Typography variant="body2">
              左側のリストからチャットを選択すると、メッセージが表示されます。
            </Typography>
          </NoSelectionContainer>
        )}
      </ChatAreaContainer>

      {/* モバイルビュー */}
      {isMobileView && showMobileChat && selectedChat && (
        <ChatAreaContainerMobile>
          {renderChatArea()}
        </ChatAreaContainerMobile>
      )}
    </ChatContainer>
  );
};
