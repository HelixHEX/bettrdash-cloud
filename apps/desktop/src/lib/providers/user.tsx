import { createContext, useState } from "react";
import { Heading } from "@chakra-ui/react";
import { auth } from "../api/queries";

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isPending: loading } = auth.useSession();
  const [user, setUser] = useState<User | null>(data ? data.user : null);

  if (loading) return <Heading>Loading...</Heading>;

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
