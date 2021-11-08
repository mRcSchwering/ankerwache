import React from "react";

export interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

type LocationContextType = {
  loc: LocationType | null;
  updateLoc: (d: LocationType | null) => void;
};

const defaultContext = {
  loc: null,
  updateLoc: () => {},
};

export const LocationContext =
  React.createContext<LocationContextType>(defaultContext);

type LocationContextProviderProps = {
  children: React.ReactNode;
};

export function LocationContextProvider(props: LocationContextProviderProps) {
  const [state, setState] = React.useState<LocationType | null>(null);

  function updateLoc(loc: LocationType | null) {
    setState(loc);
  }

  return (
    <LocationContext.Provider value={{ loc: state, updateLoc }}>
      {props.children}
    </LocationContext.Provider>
  );
}
