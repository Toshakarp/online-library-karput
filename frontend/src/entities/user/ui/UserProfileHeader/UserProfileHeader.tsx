import { Calendar } from 'lucide-react';
import { UserProfile } from 'shared-types';
import { Avatar } from '@/shared/ui/Avatar/Avatar';
import styles from './UserProfileHeader.module.scss';

interface UserProfileHeaderProps {
  user: UserProfile;
}

export const UserProfileHeader = ({ user }: UserProfileHeaderProps) => {
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className={styles.card}>
      <Avatar
        src={user.avatarUrl ?? undefined}
        name={user.displayName || user.username}
        size="xl"
      />
      <div className={styles.info}>
        <h1 className={styles.displayName}>{user.displayName || user.username}</h1>
        <p className={styles.username}>@{user.username}</p>
        <p className={styles.joined}>
          <Calendar size={13} />
          Joined {joinDate}
        </p>
      </div>
    </div>
  );
};
