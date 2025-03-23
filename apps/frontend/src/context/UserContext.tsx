import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';

interface UserContextType {
  userId: string | null;
  email: string | null;
  loading: boolean;
  idToken: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  userId: null,
  email: null,
  loading: true,
  idToken: null,
  refreshUser: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [idToken, setIdToken] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      setUserId(user.userId);

      const attributes = await fetchUserAttributes();
      setEmail(attributes.email || null);
      
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString() || null;
      setIdToken(token);

    } catch (err) {
      console.log('No authenticated user:', err);
      setUserId(null);
      setEmail(null);
      setIdToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userId,
        email,
        loading,
        idToken,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);