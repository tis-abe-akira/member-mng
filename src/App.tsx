import { Box, Fab, styled, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import { useState } from 'react';
import { Member } from './types';
import { useMembers } from './hooks/useMembers';
import { useTags } from './hooks/useTags';
import { useChats } from './hooks/useChats';
import { MemberList } from './components/MemberList/MemberList';
import { MemberDetail } from './components/MemberDetail/MemberDetail';
import { MemberForm } from './components/MemberForm/MemberForm';
import { TagManagement } from './components/TagManagement/TagManagement';
import { ChatPage } from './components/Chat/ChatPage';

// ビューの種類を定義
type View = 'members' | 'chat';

const AppContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  flexDirection: 'column',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(10), // ナビゲーションの高さ分の余白を増やしてFABとの重なりを防止
  overflow: 'auto',
}));

const NavigationContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar,
}));

const FabContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(8), // ナビゲーションバーの上に表示されるように調整
  right: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  '& > button': {
    boxShadow: theme.shadows[3],
  },
  zIndex: theme.zIndex.appBar + 1, // ナビゲーションより上に表示されるようにzIndexを設定
}));

function App() {
  const {
    members,
    selectedMember,
    setSelectedMember,
    addMember,
    updateMember,
    deleteMember,
    reorderMembers,
  } = useMembers();

  const {
    tags,
    addTag,
    updateTag,
    deleteTag,
  } = useTags();

  // すべてのチャット関連の状態を取得
  const chatState = useChats();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTagManagementOpen, setIsTagManagementOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | undefined>(undefined);
  const [currentView, setCurrentView] = useState<View>('members');

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setIsDetailOpen(true);
  };

  const handleAddClick = () => {
    setEditingMember(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = () => {
    if (selectedMember) {
      setEditingMember(selectedMember);
      setIsFormOpen(true);
      setIsDetailOpen(false);
    }
  };

  const handleFormSubmit = (formData: Omit<Member, 'id' | 'isEditable' | 'createdAt'>) => {
    if (editingMember) {
      updateMember(editingMember.id, formData);
    } else {
      // 新しいメンバーを追加し、返されたメンバー情報を使ってチャットも作成
      const newMember = addMember(formData);
      chatState.createChat(newMember.id);
    }
    setIsFormOpen(false);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingMember(undefined);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSelectedMember(null);
  };

  return (
    <AppContainer>
      <ContentContainer>
        {currentView === 'members' ? (
          <MemberList
            members={members}
            onMemberClick={handleMemberClick}
            onReorder={reorderMembers}
          />
        ) : (
          <ChatPage 
            members={members}
            chats={chatState.chats}
            selectedChat={chatState.selectedChat}
            selectChat={chatState.selectChat}
            sendMessage={chatState.sendMessage}
            createChat={chatState.createChat}
            deleteChat={chatState.deleteChat}
            getChatMessages={chatState.getChatMessages}
            currentUserId={chatState.currentUserId}
          />
        )}
      </ContentContainer>

      <MemberDetail
        member={selectedMember}
        open={isDetailOpen}
        onClose={handleDetailClose}
        onEdit={handleEditClick}
        onDelete={deleteMember}
      />

      <MemberForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        member={editingMember}
        availableTags={tags}
      />

      <TagManagement
        open={isTagManagementOpen}
        onClose={() => setIsTagManagementOpen(false)}
        tags={tags}
        onAddTag={addTag}
        onUpdateTag={updateTag}
        onDeleteTag={deleteTag}
      />

      {/* FABボタン（メンバービューでのみ表示） */}
      {currentView === 'members' && (
        <FabContainer>
          <Fab
            color="secondary"
            aria-label="タグ管理"
            onClick={() => setIsTagManagementOpen(true)}
            size="medium"
          >
            <LocalOfferIcon />
          </Fab>
          <Fab
            color="primary"
            aria-label="メンバー追加"
            onClick={handleAddClick}
            size="large"
          >
            <AddIcon />
          </Fab>
        </FabContainer>
      )}

      {/* ナビゲーション */}
      <NavigationContainer elevation={3}>
        <BottomNavigation
          value={currentView}
          onChange={(_, newValue) => setCurrentView(newValue as View)}
          showLabels
        >
          <BottomNavigationAction 
            label="メンバー" 
            value="members" 
            icon={<PeopleIcon />} 
          />
          <BottomNavigationAction 
            label="チャット" 
            value="chat" 
            icon={<ChatIcon />} 
          />
        </BottomNavigation>
      </NavigationContainer>
    </AppContainer>
  );
}

export default App;
