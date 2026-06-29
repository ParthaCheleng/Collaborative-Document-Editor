"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface User {
  id: string;
  name: string;
}

export const SEEDED_USERS: User[] = [
  { id: "e5555555-5555-5555-5555-555555555555", name: "You" },
  { id: "a1111111-1111-1111-1111-111111111111", name: "Alice" },
  { id: "b2222222-2222-2222-2222-222222222222", name: "Bob" },
  { id: "c3333333-3333-3333-3333-333333333333", name: "Charlie" },
  { id: "d4444444-4444-4444-4444-444444444444", name: "Diana" },
];

interface AuthContextType {
  activeUser: User;
  users: User[];
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [activeUser, setActiveUser] = useState<User>(SEEDED_USERS[0]);

  const switchUser = useCallback((userId: string) => {
    const user = SEEDED_USERS.find((u) => u.id === userId);
    if (user) setActiveUser(user);
  }, []);

  return (
    <AuthContext.Provider
      value={{ activeUser, users: SEEDED_USERS, switchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
