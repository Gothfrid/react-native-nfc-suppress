export interface BaseProps {
  debug?: boolean;
}

export interface StateListenerProps extends BaseProps {
  callback: (state: boolean) => void;
}
