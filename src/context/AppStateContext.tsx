import { HotkeysProvider } from "@blueprintjs/core";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
import { GlobalMapContextProvider } from "~/components/Map/GlobalMapContext";
import { MapFilterContextProvider } from "~/components/Map/filter/MapFilterContext";
import { AppContextProvider } from "~/lib/context/AppContext";
import StyledComponentsRegistry from "~/lib/context/Registry";
import SWRConfigProvider from "~/lib/fetchers/SWRConfigProvider";
import { ExpertModeContextProvider } from "~/lib/useExpertMode";
import { CategoryFilterContextProvider } from "~/modules/categories/contexts/CategoryFilterContext";
import { NeedsContextProvider } from "~/modules/needs/hooks/useNeeds";
import { SheetContextProvider } from "~/modules/sheet/SheetContext";
export function AppStateContext({ children }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider attribute="class">
        <Theme
          accentColor="indigo"
          grayColor="sand"
          radius="medium"
          scaling="100%"
          panelBackground="solid"
        >
          <HotkeysProvider>
            <ExpertModeContextProvider>
              <SWRConfigProvider>
                <NeedsContextProvider>
                  <AppContextProvider>
                    <SheetContextProvider>
                      <GlobalMapContextProvider>
                        <MapFilterContextProvider>
                          <CategoryFilterContextProvider>
                            {children}
                          </CategoryFilterContextProvider>
                        </MapFilterContextProvider>
                      </GlobalMapContextProvider>
                    </SheetContextProvider>
                  </AppContextProvider>
                </NeedsContextProvider>
              </SWRConfigProvider>
            </ExpertModeContextProvider>
          </HotkeysProvider>
        </Theme>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
