import { Box, Typography, styled } from '@mui/material';
import { Message } from '../../types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showSenderName?: boolean;
  senderName?: string;
}

const MessageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '70%',
  marginBottom: theme.spacing(1.5),
}));

const BubbleContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCurrentUser',
})<{ isCurrentUser: boolean }>(({ theme, isCurrentUser }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: isCurrentUser 
    ? '20px 20px 0px 20px' 
    : '20px 20px 20px 0px',
  backgroundColor: isCurrentUser 
    ? theme.palette.primary.main 
    : theme.palette.grey[100],
  color: isCurrentUser 
    ? theme.palette.primary.contrastText 
    : theme.palette.text.primary,
  wordBreak: 'break-word',
}));

const SenderName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.75rem',
  marginBottom: theme.spacing(0.5),
  color: theme.palette.text.secondary,
}));

const TimeStamp = styled(Typography)(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  alignSelf: 'flex-end',
  marginTop: theme.spacing(0.5),
}));

export const MessageBubble = ({ message, isCurrentUser, showSenderName = false, senderName }: MessageBubbleProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
        width: '100%',
      }}
    >
      <MessageContainer>
        {showSenderName && senderName && (
          <SenderName variant="caption" align={isCurrentUser ? "right" : "left"}>
            {senderName}
          </SenderName>
        )}
        <BubbleContent isCurrentUser={isCurrentUser}>
          <Typography variant="body2">
            {message.content}
          </Typography>
        </BubbleContent>
        <TimeStamp variant="caption">
          {format(new Date(message.timestamp), 'HH:mm', { locale: ja })}
        </TimeStamp>
      </MessageContainer>
    </Box>
  );
};
