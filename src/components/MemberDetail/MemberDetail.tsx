import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  styled,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Member } from '../../types';
import { useState } from 'react';

interface MemberDetailProps {
  member: Member | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (memberId: string) => void;
}

const DetailImage = styled('img')({
  width: '100%',
  maxWidth: 300,
  height: 300,
  objectFit: 'cover',
  borderRadius: 8,
});

const TagsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  marginTop: theme.spacing(3),
  '& > button': {
    minWidth: 120,
  },
}));

export const MemberDetail = ({ member, open, onClose, onEdit, onDelete }: MemberDetailProps) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  if (!member) return null;

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(member.id);
    setDeleteConfirmOpen(false);
    onClose();
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" component="div">
            {member.name}
          </Typography>
          <CloseButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </CloseButton>
        </DialogTitle>

        <DialogContent key={member.id}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, pt: 2 }}>
            <DetailImage src={member.imageUrl} alt={member.name} />

            <TagsContainer>
              {member.tags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  sx={{
                    backgroundColor: tag.color,
                    color: 'white',
                  }}
                />
              ))}
            </TagsContainer>

            <Typography variant="body1" sx={{ width: '100%', whiteSpace: 'pre-wrap' }}>
              {member.introduction}
            </Typography>

            {member.isEditable && (
              <ButtonGroup>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={onEdit}
                  size="large"
                >
                  編集する
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteClick}
                  size="large"
                >
                  削除する
                </Button>
              </ButtonGroup>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>
          部員を削除
        </DialogTitle>
        <DialogContent>
          <Typography>
            {member.name}さんを削除してもよろしいですか？
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>
            キャンセル
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
