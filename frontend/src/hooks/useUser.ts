import { useEffect, useState, useCallback } from 'react';
import { User } from '@/types/user';
import { fetchUserById, updateUser } from '@/services/userService';

export function useUser(userId?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy user từ backend theo id
  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }
    setLoading(true);
    setError(null);

    fetchUserById(userId)
      .then(setUser)
      .catch((err) => setError(err?.message || 'Lỗi lấy thông tin user'))
      .finally(() => setLoading(false));
  }, [userId]);

  // Hàm cập nhật user (trả về user đã update)
  const saveUser = useCallback(
    async (data: Partial<User>) => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const updated = await updateUser(userId, data);
        setUser(updated);
        return updated;
      } catch (err: any) {
        setError(err?.message || 'Lỗi cập nhật user');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return { user, loading, error, saveUser };
}
