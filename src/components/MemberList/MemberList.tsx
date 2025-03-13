import { Box, Typography, styled } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Member } from '../../types';
import { MemberCard } from './MemberCard';

interface MemberListProps {
  members: Member[];
  onMemberClick: (member: Member) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

const ListContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: 800,
  margin: '0 auto',
}));

const DroppableContainer = styled(Box)({
  minHeight: 400,
});

export const MemberList = ({ members, onMemberClick, onReorder }: MemberListProps) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <ListContainer>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        部員一覧
      </Typography>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="members">
          {(provided) => (
            <DroppableContainer
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {members.map((member, index) => (
                <Draggable
                  key={member.id}
                  draggableId={member.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        opacity: snapshot.isDragging ? 0.8 : 1,
                        transform: snapshot.isDragging ? 'scale(1.02)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <MemberCard
                        member={member}
                        onClick={() => onMemberClick(member)}
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </DroppableContainer>
          )}
        </Droppable>
      </DragDropContext>
    </ListContainer>
  );
};
