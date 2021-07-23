import { Observer } from "mobx-react-lite";
import { createContext, ReactElement, useContext } from "react";
import { RootStore } from "./RootStore";

export const rootStore = new RootStore();
export const StoreContext = createContext(rootStore);

interface StoreProviderProps {
  children: React.ReactNode | (() => void);
}

export const StoreProvider = ({
  children,
}: StoreProviderProps): JSX.Element => (
  <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
);

interface StoreConsumerProps {
  children: (stores: InstanceType<typeof RootStore>) => ReactElement;
}

export const StoreConsumer = ({
  children,
}: StoreConsumerProps): JSX.Element => (
  <StoreContext.Consumer>
    {(s) => <Observer>{() => children(s)}</Observer>}
  </StoreContext.Consumer>
);

export const useStores = (): RootStore => {
  return useContext(StoreContext);
};

export * from "./RootStore";
export * from "./PlayerStore";
export * from "./AuthStore";
