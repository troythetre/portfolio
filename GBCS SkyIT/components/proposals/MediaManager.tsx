import { useContext, useEffect, useState } from "react";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  listAll,
  ref,
  StorageReference,
} from "firebase/storage";
import { auth, storage } from "../../firebase.js";
import {
  BackgroundImage,
  Modal,
  SimpleGrid,
  Checkbox,
  UnstyledButton,
  Button,
  Group,
} from "@mantine/core";
import { useUploadFile } from "react-firebase-hooks/storage";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { nanoid } from "nanoid";
import { MediaManagerContext } from "../../contexts/MediaManagerProvider";

interface imageStore {
  url: string;
  ref: StorageReference;
  timeCreated: Date;
}

// Media Manager accessible to all components via MediaManagerContext
export default function MediaManager({ opened, imageHandler = null }: any) {
  const { setMediaManagerOpened: setOpened } = useContext(MediaManagerContext);
  const [images, setImages] = useState<imageStore[]>([]);
  const [selectedImage, setSelectedImage] = useState<StorageReference | null>(
    null
  );
  const [uploadFile] = useUploadFile();
  let imageCount = 0;

  const uid = auth.currentUser?.uid;
  async function getImages(uid: string) {
    setImages([]); // Reset all images
    // listAll returns prefixes (which we don't care about) and
    // a list of all items/file refs (which we do want)
    const imageObjects = await listAll(ref(storage, `${uid}/images/`));
    imageCount = imageObjects.items.length;

    const imagePromises = imageObjects.items.map(async (imageObject) => {
      const url = await getDownloadURL(imageObject);
      const metadata = await getMetadata(imageObject);
      return {
        url,
        ref: imageObject,
        timeCreated: new Date(metadata.timeCreated),
      };
    });
    const imagesList = await Promise.all(imagePromises);

    // Basic sorting, but this isn't necessary
    // I just didn't want to vomit every time I opened the MediaManager
    setImages(
      imagesList.sort(
        (a, b) => b.timeCreated.getTime() - a.timeCreated.getTime()
      )
    );
  }

  useEffect(() => {
    if (uid && opened) getImages(uid);
  }, [opened, uid]); // eslint-disable-line

  return (
    <Modal
      title="Media Manager"
      opened={opened}
      onClose={() => {
        setSelectedImage(null);
        setOpened(false);
      }}
      centered
      overflow="inside"
      size="80%" // As you can see, this isn't mobile responsive
    >
      {images.length > 0 ? (
        <SimpleGrid cols={4}>
          {images.map(({ ref, url }, index) => (
            <UnstyledButton
              className="w-full"
              key={index}
              onClick={() =>
                setSelectedImage((current) => (current === ref ? null : ref))
              }
            >
              <BackgroundImage
                src={url}
                className="w-full aspect-square flex justify-end items-start hover:brightness-125 hover:shadow-md"
                radius="md"
                p="md"
              >
                <Checkbox checked={selectedImage === ref} onChange={() => {}} />
              </BackgroundImage>
            </UnstyledButton>
          ))}
        </SimpleGrid>
      ) : (
        <div className="justify-center flex items-center bg-zinc-800 rounded-md p-10">
          {imageCount === 0 ? "No images found." : "Loading images..."}
        </div>
      )}

      {/* If an image has been selected, allow deletion or usage */}
      {selectedImage && (
        <Group>
          {imageHandler && (
            <Button
              mt="lg"
              onClick={() => {
                imageHandler(selectedImage);
                setSelectedImage(null);
                setOpened(false);
              }}
            >
              Use Image
            </Button>
          )}
          <Button
            mt="lg"
            color="red"
            onClick={async () => {
              await deleteObject(selectedImage);
              getImages();
              setSelectedImage(null);
            }}
          >
            Delete
          </Button>
        </Group>
      )}
      <Dropzone
        accept={IMAGE_MIME_TYPE}
        onDrop={async (files) => {
          const file = files[0];
          await uploadFile(ref(storage, `${uid}/images/${nanoid()}`), file);
          getImages(uid);
        }}
      >
        {(_status) => <Button mt="lg">Add Image</Button>}
      </Dropzone>
    </Modal>
  );
}
