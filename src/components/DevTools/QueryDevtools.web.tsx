import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function QueryDevtools() {
  if (!__DEV__) {
    return null;
  }
  return <ReactQueryDevtools initialIsOpen={false} />;
}
