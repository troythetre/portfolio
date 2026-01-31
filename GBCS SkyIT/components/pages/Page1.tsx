import EditableImage from "../proposals/EditableImage";
import EditableText from "../proposals/EditableText";
import HeaderEdit from "../proposals/HeaderEdit";

export function Page1({ proposalData, pageData, pageDocRef }: any) {
  return (
    <>
      <div
        className={`text-white top-32 w-2/3 absolute p-10 pl-16 text-6xl leading-tight font-bold z-10`}
        style={{
          backgroundColor: proposalData.globalColor,
        }}
      >
        <HeaderEdit
          heading={pageData.heading}
          className="m-0"
          pageDocRef={pageDocRef}
        />
      </div>
      <div className="flex flex-col py-16 px-20 h-full gap-8">
        <EditableImage
          photos={pageData.photos}
          pageRef={pageDocRef}
          className="grow"
          photoIndex={0}
        />
        <div className="flex h-44 justify-between gap-3">
          <EditableImage
            src={proposalData.clientLogoURL}
            className="bg-contain w-64"
            accessor="clientLogoURL"
          />
          <EditableText
            className="self-center w-full"
            text={pageData.body}
            pageRef={pageDocRef}
            roomName={`${pageData.id}${proposalData.id}`}
          />
          <EditableImage
            src={proposalData.userLogoURL}
            className="bg-contain w-64"
            accessor="userLogoURL"
          />
        </div>
      </div>
    </>
  );
}
