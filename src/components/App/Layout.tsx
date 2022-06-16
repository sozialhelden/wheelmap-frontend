import React from "react";
import { useCurrentApp } from "../../lib/data-fetching/useCurrentApp";
import HeadMetaTags from "./HeadMetaTags";
import MainMenu from "./MainMenu/MainMenu";

export default function Layout({ children }: { children?: React.ReactNode }) {
  // const { data, error } = useSWR('/api/navigation', fetcher)

  // if (error) return <div>Failed to load</div>
  // if (!data) return <div>Loading...</div>

  const { clientSideConfiguration } = useCurrentApp();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleMainMenu = React.useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  return (
    <>
      <HeadMetaTags />

      <MainMenu
        onToggle={toggleMainMenu}
        isOpen={isMenuOpen}
        clientSideConfiguration={clientSideConfiguration}
      />

      <main>{children}</main>
    </>
  );
}
