import { Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Avatar, Typography, Badge, styled } from '@mui/material';
import { Chat, Member } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  marginBottom: theme.spacing(1),
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
}));

const UnreadBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: 10,
    height: 20,
    minWidth: 20,
    borderRadius: 10,
  },
}));

interface ChatListProps {
  chats: Chat[];
  members: Member[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  currentUserId: string;
}

export const ChatList = ({ chats, members, selectedChatId, onChatSelect, currentUserId }: ChatListProps) => {
  // チャットの相手を取得する関数
  const getOtherParticipant = (chat: Chat): Member | undefined => {
    const otherParticipantId = chat.participants.find(id => id !== currentUserId);
    return members.find(member => member.id === otherParticipantId);
  };

  // 未読メッセージの数を取得する関数
  const getUnreadCount = (chat: Chat): number => {
    if (!chat.lastMessage) return 0;
    return chat.lastMessage.receiverId === currentUserId && !chat.lastMessage.isRead ? 1 : 0;
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <List disablePadding>
        {chats.map((chat) => {
          const otherParticipant = getOtherParticipant(chat);
          const unreadCount = getUnreadCount(chat);
          
          return (
            <StyledListItem key={chat.id} disablePadding>
              <StyledListItemButton
                selected={selectedChatId === chat.id}
                onClick={() => onChatSelect(chat.id)}
              >
                <ListItemAvatar>
                  <Avatar src={otherParticipant?.imageUrl} alt={otherParticipant?.name}>
                    {otherParticipant?.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      component="span"
                      variant="body1"
                      fontWeight={unreadCount > 0 ? 700 : 400}
                    >
                      {otherParticipant?.name || '不明なユーザー'}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ 
                        display: 'inline-block', 
                        maxWidth: '100%',
                        fontWeight: unreadCount > 0 ? 700 : 400
                      }}
                    >
                      {chat.lastMessage?.content || '新しい会話を始めましょう'}
                    </Typography>
                  }
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {chat.updatedAt ? formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true, locale: ja }) : ''}
                  </Typography>
                  {unreadCount > 0 && (
                    <UnreadBadge badgeContent={unreadCount} color="primary" />
                  )}
                </Box>
              </StyledListItemButton>
            </StyledListItem>
          );
        })}
      </List>
    </Box>
  );
};
