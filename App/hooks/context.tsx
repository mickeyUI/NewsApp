import { createContext, useContext, useState, ReactNode } from "react";

type NotificationContextType = {
  pendingPostId: string | null;
  setPendingPostId: (id: string | null) => void;
};

const NotificationContext = createContext<NotificationContextType | any>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [pendingPostId, setPendingPostId] = useState<string | null>(null);

  return (
    <NotificationContext.Provider
      value={{
        pendingPostId,
        setPendingPostId,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function getContext() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }

  return context;
}
