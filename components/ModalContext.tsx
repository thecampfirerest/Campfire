"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ModalContextType = {
  modal: string | null;
  open: (m: string) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType>({
  modal: null,
  open: () => {},
  close: () => {},
});

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<string | null>(null);
  function open(m: string) { setModal(m); }
  function close() { setModal(null); }
  return <ModalContext.Provider value={{ modal, open, close }}>{children}</ModalContext.Provider>;
}

export function useModal() {
  return useContext(ModalContext);
}
