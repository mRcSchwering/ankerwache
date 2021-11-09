import React from "react";

export interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

type BkgLocationContextType = {
  loc: LocationType | null;
  setLoc: (d: LocationType | null) => void;
};

const defaultContext = {
  loc: null,
  setLoc: () => {},
};

export const BkgLocationContext =
  React.createContext<BkgLocationContextType>(defaultContext);

type BkgLocationContextProviderProps = {
  children: React.ReactNode;
};

export function BkgLocationContextProvider(
  props: BkgLocationContextProviderProps
) {
  const [loc, setLoc] = React.useState<LocationType | null>(null);

  return (
    <BkgLocationContext.Provider value={{ loc, setLoc }}>
      {props.children}
    </BkgLocationContext.Provider>
  );
}
