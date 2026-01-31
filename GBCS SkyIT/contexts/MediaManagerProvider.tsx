import { createContext, useState } from "react";
import MediaManager from "../components/proposals/MediaManager";

export const MediaManagerContext = createContext({});

// Context for opening the media manager and setting actions
export default function MediaManagerProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [mediaManagerOpened, setMediaManagerOpened] = useState(false);
  const [imageHandler, setImageHandler] = useState<(imageRef: string) => void>(
    () => {}
  );

  return (
    <MediaManagerContext.Provider
      value={{
        setMediaManagerOpened,
        setImageHandler,
      }}
    >
      {children}
      <MediaManager opened={mediaManagerOpened} imageHandler={imageHandler} />
    </MediaManagerContext.Provider>
  );
}
