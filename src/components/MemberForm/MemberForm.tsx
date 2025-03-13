import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  IconButton,
  Autocomplete,
  styled,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState, useEffect, useCallback } from 'react';
import { Member, MemberFormData, Tag } from '../../types';

interface MemberFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MemberFormData) => void;
  member?: Member;
  availableTags: Tag[];
}

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
}));

const PreviewImage = styled('img')({
  width: '100%',
  maxWidth: 200,
  height: 200,
  objectFit: 'cover',
  borderRadius: 4,
  marginTop: 8,
});

const DropZone = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const MemberForm = ({
  open,
  onClose,
  onSubmit,
  member,
  availableTags,
}: MemberFormProps) => {
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    imageUrl: '',
    introduction: '',
    tags: [],
  });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        imageUrl: member.imageUrl,
        introduction: member.introduction,
        tags: member.tags,
      });
    } else {
      setFormData({
        name: '',
        imageUrl: '',
        introduction: '',
        tags: [],
      });
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          imageUrl: base64String,
          imageData: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          imageUrl: base64String,
          imageData: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          position: 'relative',
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {member ? 'メンバー情報を編集' : '新しいメンバーを追加'}
          <CloseButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </CloseButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="名前"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              fullWidth
            />

            <Box>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                onChange={handleFileSelect}
              />
              <label htmlFor="image-upload">
                <DropZone
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  sx={{
                    backgroundColor: isDragging ? 'action.hover' : 'background.default',
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography>
                    画像をドラッグ&ドロップ、またはクリックしてアップロード
                  </Typography>
                </DropZone>
              </label>
            </Box>

            {formData.imageUrl && (
              <PreviewImage src={formData.imageUrl} alt="プレビュー" />
            )}

            <TextField
              label="自己紹介"
              value={formData.introduction}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, introduction: e.target.value }))
              }
              required
              fullWidth
              multiline
              rows={4}
            />

            <Autocomplete
              multiple
              options={availableTags}
              value={formData.tags}
              onChange={(_, newValue) =>
                setFormData((prev) => ({ ...prev, tags: newValue }))
              }
              getOptionLabel={(option) => option.name}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.id}
                    label={option.name}
                    sx={{
                      backgroundColor: option.color,
                      color: 'white',
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="タグ" placeholder="タグを選択" />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>キャンセル</Button>
          <Button type="submit" variant="contained">
            {member ? '更新' : '追加'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
