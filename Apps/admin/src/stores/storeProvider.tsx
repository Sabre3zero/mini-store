import { createContext, ReactNode } from "react";
import { rootStore, type RootStore } from "./RootStore";

export const StoreContext = createContext<RootStore | null>(null);

type StoreProvidedProps = {
  children: ReactNode;
};

export function StoreProvider({ children }: StoreProvidedProps) {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
}
