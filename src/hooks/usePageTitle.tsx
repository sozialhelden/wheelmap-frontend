import { type ReactNode, createContext, useContext, useState } from "react";

type PageTitleContext = {
  title?: string;
  setTitle: (title?: string) => void;
};

const PageTitleContext = createContext<PageTitleContext>({
  setTitle: () => {},
});

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string>();

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitle(): PageTitleContext {
  return useContext(PageTitleContext);
}
