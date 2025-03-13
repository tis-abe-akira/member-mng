import { useState } from 'react';
import { Box, TextField, IconButton, styled } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    backgroundColor: theme.palette.grey[100],
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export const MessageInput = ({ onSendMessage, disabled = false }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <InputContainer>
      <IconButton color="primary" aria-label="添付ファイル">
        <AddCircleOutlineIcon />
      </IconButton>
      <StyledTextField
        placeholder="メッセージを入力..."
        variant="outlined"
        size="small"
        fullWidth
        multiline
        maxRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        InputProps={{
          sx: { py: 0.5, px: 1.5 },
        }}
      />
      <IconButton 
        color="primary" 
        onClick={handleSend} 
        disabled={!message.trim() || disabled}
        sx={{ ml: 1 }}
      >
        <SendIcon />
      </IconButton>
    </InputContainer>
  );
};
