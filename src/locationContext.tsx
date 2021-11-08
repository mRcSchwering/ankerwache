import React from "react";

export interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

type LocationContextType = {
  currentBkg: LocationType | null;
  setCurrentBkg: (d: LocationType | null) => void;
};

const defaultContext = {
  currentBkg: null,
  setCurrentBkg: () => {},
};

export const LocationContext =
  React.createContext<LocationContextType>(defaultContext);

type LocationContextProviderProps = {
  children: React.ReactNode;
};

export function LocationContextProvider(props: LocationContextProviderProps) {
  const [currentBkg, setCurrentBkg] = React.useState<LocationType | null>(null);

  return (
    <LocationContext.Provider value={{ currentBkg, setCurrentBkg }}>
      {props.children}
    </LocationContext.Provider>
  );
}
