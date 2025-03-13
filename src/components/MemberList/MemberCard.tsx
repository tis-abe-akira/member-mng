import { Card, CardContent, CardMedia, Typography, Chip, Box, styled } from '@mui/material';
import { Member } from '../../types';

interface MemberCardProps {
  member: Member;
  onClick: () => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  margin: theme.spacing(1),
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    transition: 'all 0.3s ease-in-out',
  },
}));

const ContentWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

const TagsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}));

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const MemberCard = ({ member, onClick }: MemberCardProps) => {
  return (
    <StyledCard onClick={onClick}>
      <CardMedia
        component="img"
        sx={{ width: 120, height: 120, objectFit: 'cover' }}
        image={member.imageUrl}
        alt={member.name}
      />
      <ContentWrapper>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            {member.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {truncateText(member.introduction, 100)}
          </Typography>
          <TagsContainer>
            {member.tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                sx={{
                  backgroundColor: tag.color,
                  color: 'white',
                }}
              />
            ))}
          </TagsContainer>
        </CardContent>
      </ContentWrapper>
    </StyledCard>
  );
};
