import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type PageTitleContextValue = {
  title?: string;
  setTitle: (title?: string) => void;
};

const PageTitleContext = createContext<PageTitleContextValue | null>(null);

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | undefined>(undefined);

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitle(newTitle?: string) {
  const context = useContext(PageTitleContext);
  if (!context) {
    throw new Error("usePageTitle must be used inside <PageTitleProvider>");
  }

  useEffect(() => {
    if (newTitle !== undefined && newTitle !== context.title) {
      context.setTitle(newTitle);
    }
  }, [newTitle, context]);

  return { title: context.title, setTitle: context.setTitle };
}
