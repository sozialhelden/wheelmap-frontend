import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export const breakpoints = {
  initial: 0,
  xs: 520,
  sm: 768,
  md: 1024,
  lg: 1280,
  xl: 1640,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export type BreakpointContextType = {
  active: Breakpoint;
  greaterOrEqual: (givenBreakpoint: Breakpoint) => boolean;
  greater: (givenBreakpoint: Breakpoint) => boolean;
  smallerOrEqual: (givenBreakpoint: Breakpoint) => boolean;
  smaller: (givenBreakpoint: Breakpoint) => boolean;
  between: (
    lowerBreakpoint: Breakpoint,
    higherBreakpoint: Breakpoint,
  ) => boolean;
};

export const BreakpointContext = createContext<BreakpointContextType>({
  greaterOrEqual: () => false,
  greater: () => false,
  smallerOrEqual: () => false,
  smaller: () => false,
  between: () => false,
  active: "initial",
});

export function useBreakpoints() {
  return useContext(BreakpointContext);
}

export function BreakpointContextProvider({
  children,
}: { children: ReactNode }) {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xs");

  const calculate = () => {
    setBreakpoint(
      Object.entries(breakpoints)
        .reverse()
        .find(([_, minWidth]) => {
          return window.matchMedia(`(min-width: ${minWidth}px)`).matches;
        })
        ?.shift() as Breakpoint,
    );
  };

  useEffect(() => {
    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  const greaterOrEqual = (givenBreakpoint: Breakpoint) =>
    breakpoints[givenBreakpoint] <= breakpoints[breakpoint];
  const greater = (givenBreakpoint: Breakpoint) =>
    breakpoints[givenBreakpoint] < breakpoints[breakpoint];
  const smallerOrEqual = (givenBreakpoint: Breakpoint) =>
    breakpoints[givenBreakpoint] >= breakpoints[breakpoint];
  const smaller = (givenBreakpoint: Breakpoint) =>
    breakpoints[givenBreakpoint] > breakpoints[breakpoint];
  const between = (lowerBreakpoint: Breakpoint, higherBreakpoint: Breakpoint) =>
    breakpoints[lowerBreakpoint] <= breakpoints[breakpoint] &&
    breakpoints[higherBreakpoint] >= breakpoints[breakpoint];

  return (
    <BreakpointContext.Provider
      value={{
        greaterOrEqual,
        greater,
        smallerOrEqual,
        smaller,
        between,
        active: breakpoint,
      }}
    >
      {children}
    </BreakpointContext.Provider>
  );
}
