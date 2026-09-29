import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, BookMarked, MessageSquare, Edit2, Lock, LogOut } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { UserProfileHeader } from '@/entities/user';
import { EditProfileModal } from '@/features/edit-profile';
import { PageContainer } from '@/shared/ui/PageContainer/PageContainer';
import { SectionGroup } from '@/shared/ui/SectionGroup/SectionGroup';
import { ActionCard } from '@/shared/ui/ActionCard/ActionCard';
import { ROUTES } from '@/shared/config/routes';

const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <PageContainer size="md">
      <UserProfileHeader user={user} />

      <SectionGroup title="My Library">
        <ActionCard
          icon={<Heart size={20} />}
          iconBg="danger"
          title="My Likes"
          description="Books you have liked"
          onClick={() => navigate(ROUTES.MY_BOOKS_CATEGORY('liked'))}
        />
        <ActionCard
          icon={<BookMarked size={20} />}
          iconBg="purple"
          title="Reading List"
          description="Books on your reading list"
          onClick={() => navigate(ROUTES.MY_BOOKS_CATEGORY('reading_list'))}
        />
        <ActionCard
          icon={<MessageSquare size={20} />}
          iconBg="brand"
          title="My Comments"
          description="Your book reviews and comments"
          onClick={() => navigate(ROUTES.MY_COMMENTS)}
        />
      </SectionGroup>

      <SectionGroup title="Account & Security">
        <ActionCard
          icon={<Edit2 size={20} />}
          iconBg="brand"
          title="Edit Profile"
          description="Update your display name, username, and avatar"
          onClick={() => setEditOpen(true)}
        />
        <ActionCard
          icon={<Lock size={20} />}
          iconBg="neutral"
          title="Change Password"
          description="Update your account password"
          onClick={() => navigate(ROUTES.CHANGE_PASSWORD)}
        />
        <ActionCard
          icon={<LogOut size={20} />}
          iconBg="neutral"
          title="Sign Out"
          description="Sign out of your current session"
          onClick={handleLogout}
        />
      </SectionGroup>

      <EditProfileModal isOpen={editOpen} onClose={() => setEditOpen(false)} />
    </PageContainer>
  );
};

export default ProfilePage;
