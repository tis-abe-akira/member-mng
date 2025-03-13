import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { Tag } from '../../types';

interface TagManagementProps {
  open: boolean;
  onClose: () => void;
  tags: Tag[];
  onAddTag: (tag: Omit<Tag, 'id'>) => void;
  onUpdateTag: (id: string, tag: Omit<Tag, 'id'>) => void;
  onDeleteTag: (id: string) => void;
}

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
}));

const ColorPreview = styled(Box)({
  width: 24,
  height: 24,
  borderRadius: 4,
  marginRight: 8,
});

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(3)} !important`,
}));

const defaultColors = [
  '#2196f3', // Blue
  '#f44336', // Red
  '#4caf50', // Green
  '#ff9800', // Orange
  '#9c27b0', // Purple
  '#795548', // Brown
  '#009688', // Teal
  '#607d8b', // Blue Grey
];

type TagCategory = 'position' | 'hobby' | 'other';

export const TagManagement = ({
  open,
  onClose,
  tags,
  onAddTag,
  onUpdateTag,
  onDeleteTag,
}: TagManagementProps) => {
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTag, setNewTag] = useState<{
    name: string;
    category: TagCategory;
    color: string;
  }>({
    name: '',
    category: 'other',
    color: defaultColors[0],
  });

  const handleAddTag = () => {
    if (newTag.name.trim()) {
      onAddTag(newTag);
      setNewTag({
        name: '',
        category: 'other',
        color: defaultColors[0],
      });
    }
  };

  const handleUpdateTag = () => {
    if (editingTag && editingTag.name.trim()) {
      onUpdateTag(editingTag.id, {
        name: editingTag.name,
        category: editingTag.category,
        color: editingTag.color,
      });
      setEditingTag(null);
    }
  };

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
      <DialogTitle>
        タグ管理
        <CloseButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </CloseButton>
      </DialogTitle>

      <StyledDialogContent>
        <Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="新しいタグ名"
              value={newTag.name}
              onChange={(e) =>
                setNewTag((prev) => ({ ...prev, name: e.target.value }))
              }
              sx={{ flex: 1 }}
            />
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>カテゴリー</InputLabel>
              <Select
                value={newTag.category}
                label="カテゴリー"
                onChange={(e) =>
                  setNewTag((prev) => ({
                    ...prev,
                    category: e.target.value as TagCategory,
                  }))
                }
              >
                <MenuItem value="position">職位</MenuItem>
                <MenuItem value="hobby">趣味</MenuItem>
                <MenuItem value="other">その他</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>色</InputLabel>
              <Select
                value={newTag.color}
                label="色"
                onChange={(e) =>
                  setNewTag((prev) => ({ ...prev, color: e.target.value }))
                }
                renderValue={(value) => (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ColorPreview sx={{ backgroundColor: value }} />
                    {value}
                  </Box>
                )}
              >
                {defaultColors.map((color) => (
                  <MenuItem key={color} value={color}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ColorPreview sx={{ backgroundColor: color }} />
                      {color}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            onClick={handleAddTag}
            disabled={!newTag.name.trim()}
            fullWidth
          >
            タグを追加
          </Button>
        </Box>

        <List sx={{ mt: 4 }}>
          {tags.map((tag) => (
            <ListItem
              key={tag.id}
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => setEditingTag(tag)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onDeleteTag(tag.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ColorPreview sx={{ backgroundColor: tag.color }} />
                    {tag.name}
                  </Box>
                }
                secondary={
                  tag.category === 'position'
                    ? '職位'
                    : tag.category === 'hobby'
                    ? '趣味'
                    : 'その他'
                }
              />
            </ListItem>
          ))}
        </List>

        {editingTag && (
          <Dialog open={true} onClose={() => setEditingTag(null)}>
            <DialogTitle>タグを編集</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                <TextField
                  label="タグ名"
                  value={editingTag.name}
                  onChange={(e) =>
                    setEditingTag((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>カテゴリー</InputLabel>
                  <Select
                    value={editingTag.category}
                    label="カテゴリー"
                    onChange={(e) =>
                      setEditingTag((prev) =>
                        prev
                          ? {
                              ...prev,
                              category: e.target.value as TagCategory,
                            }
                          : null
                      )
                    }
                  >
                    <MenuItem value="position">職位</MenuItem>
                    <MenuItem value="hobby">趣味</MenuItem>
                    <MenuItem value="other">その他</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>色</InputLabel>
                  <Select
                    value={editingTag.color}
                    label="色"
                    onChange={(e) =>
                      setEditingTag((prev) =>
                        prev ? { ...prev, color: e.target.value } : null
                      )
                    }
                    renderValue={(value) => (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ColorPreview sx={{ backgroundColor: value }} />
                        {value}
                      </Box>
                    )}
                  >
                    {defaultColors.map((color) => (
                      <MenuItem key={color} value={color}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ColorPreview sx={{ backgroundColor: color }} />
                          {color}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                  <Button onClick={() => setEditingTag(null)}>キャンセル</Button>
                  <Button variant="contained" onClick={handleUpdateTag}>
                    更新
                  </Button>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </StyledDialogContent>
    </Dialog>
  );
};
