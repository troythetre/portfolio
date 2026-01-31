import { updateDoc } from "firebase/firestore";
import { getDownloadURL, StorageReference } from "firebase/storage";
import { BackgroundImage, ThemeIcon } from "@mantine/core";
import { useContext } from "react";
import { doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/router";
import { Camera } from "tabler-icons-react";
import { MediaManagerContext } from "../../contexts/MediaManagerProvider";

// Accessor is for changing proposal-level images such as
// Header or footer logos
interface EditableImageProps {
  src?: string;
  className?: string;
  accessor?: string;
  pageRef?: FirebaseFirestore.DocumentReference;
  photos?: string[];
  photoIndex?: number;
}

export default function EditableImage({
  src,
  className,
  accessor,
  pageRef,
  photos,
  photoIndex,
}: EditableImageProps) {
  const { setMediaManagerOpened, setImageHandler } = useContext(
    MediaManagerContext
  ) as any;
  const router = useRouter();

  // Source is required unless we are provided a list of photos and the photo index
  if (!src && photos && typeof photoIndex === "number") {
    src = photos[photoIndex];
  }

  async function imageHandler(ref: StorageReference) {
    const url = await getDownloadURL(ref);
    if (accessor) {
      await updateDoc(doc(db, `proposals/${router.query.id}`), {
        [accessor]: url,
      });
    } else if (photos && pageRef && typeof photoIndex === "number") {
      photos[photoIndex] = url;
      await updateDoc(pageRef, {
        photos,
      });
    } else {
      console.error("Invalid props for EditableImage component");
    }
  }

  return (
    <BackgroundImage
      src={src}
      className={`cursor-pointer bg-no-repeat shadow-none hover:shadow-lg transition-all ring-gray-500 ${
        !router.pathname.endsWith("raw") && "ring-1"
      } ${className}`}
      onClick={() => {
        setMediaManagerOpened(true);
        setImageHandler(() => imageHandler);
      }}
    >
      <div className="w-full h-full flex justify-center items-center bg-black/25 hover:opacity-100 opacity-0 z-10 transition">
        <ThemeIcon size="xl" variant="filled" color="dark">
          <Camera />
        </ThemeIcon>
      </div>
    </BackgroundImage>
  );
}
