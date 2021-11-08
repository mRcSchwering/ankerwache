import React from "react";

export interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

type LocationContextType = {
  current: LocationType | null;
  anchor: LocationType | null;
  setCurrent: (d: LocationType | null) => void;
  setAnchor: (d: LocationType | null) => void;
};

const defaultContext = {
  current: null,
  anchor: null,
  setCurrent: () => {},
  setAnchor: () => {},
};

export const LocationContext =
  React.createContext<LocationContextType>(defaultContext);

type LocationContextProviderProps = {
  children: React.ReactNode;
};

export function LocationContextProvider(props: LocationContextProviderProps) {
  const [current, setCurrent] = React.useState<LocationType | null>(null);
  const [anchor, setAnchor] = React.useState<LocationType | null>(null);

  return (
    <LocationContext.Provider
      value={{ current, anchor, setCurrent, setAnchor }}
    >
      {props.children}
    </LocationContext.Provider>
  );
}
