import Image from "next/image";
import AiIcon from "../../public/images/icons/AI Generated.svg";
import ArchiveIcon from "../../public/images/icons/Archive.svg";
import BookmarkIcon from "../../public/images/icons/Bookmark.svg";
import CommentHistoryIcon from "../../public/images/icons/Comment History.svg";
import CopyIcon from "../../public/images/icons/Copy.svg";
import DashboardIcon from "../../public/images/icons/Dashboard.svg";
import DeleteIcon from "../../public/images/icons/Delete.svg";
import EditIcon from "../../public/images/icons/Edit.svg";
import ExpandIcon from "../../public/images/icons/Expand.svg";
import GridViewIcon from "../../public/images/icons/Grid View.svg";
import MailIcon from "../../public/images/icons/Mail.svg";
import MediaLibIcon from '../../public/images/icons/Media Library.svg';
import NotesIcon from "../../public/images/icons/Notes.svg";
import OpenIcon from "../../public/images/icons/Open.svg";
import RedoIcon from "../../public/images/icons/Redo.svg";
import RenameIcon from "../../public/images/icons/Rename.svg";
import RestoreIcon from '../../public/images/icons/Restore.svg';
import SaveTemplateIcon from "../../public/images/icons/Save as Template.svg";
import SelectIcon from "../../public/images/icons/Select.svg";
import SendIcon from "../../public/images/icons/Send.svg";
import SinglePageIcon from "../../public/images/icons/Single Page Mode.svg";
import TextIcon from "../../public/images/icons/Text.svg";
import UndoIcon from "../../public/images/icons/Undo.svg";
import UploadIcon from "../../public/images/icons/Upload.svg";
import ViewIcon from "../../public/images/icons/View.svg";

interface IconItem {
  name: string;
  image: string;
}

const icons: IconItem[] = [
  { name: "AI Generated", image: AiIcon },
  { name: "Archive", image: ArchiveIcon },
  { name: "Bookmark", image: BookmarkIcon },
  { name: "Comment History", image: CommentHistoryIcon },
  { name: "Copy", image: CopyIcon },
  { name: "Dashboard", image: DashboardIcon },
  { name: "Delete", image: DeleteIcon },
  { name: "Edit", image: EditIcon },
  { name: "Expand", image: ExpandIcon },
  { name: "Grid View", image: GridViewIcon },
  { name: "Mail", image: MailIcon },
  { name: "Media Library", image: MediaLibIcon },
  { name: "Notes", image: NotesIcon },
  { name: "Open", image: OpenIcon },
  { name: "Redo", image: RedoIcon },
  { name: "Rename", image: RenameIcon },
  { name: "Restore", image: RestoreIcon },
  { name: "Save as Template", image: SaveTemplateIcon },
  { name: "Select", image: SelectIcon },
  { name: "Send", image: SendIcon },
  { name: "Single Page Mode", image: SinglePageIcon },
  { name: "Text", image: TextIcon },
  { name: "Undo", image: UndoIcon },
  { name: "Upload", image: UploadIcon },
  { name: "View", image: ViewIcon },
];

interface IconsProps {
  styles: { [key: string]: string };
}

const Icons = ({ styles }: IconsProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.headers}>
        <h3 className="text-4xl">Icons</h3>
        <p className="text-base">
          Use auto layout with a 30x30 frame, fixed width and height, horizontal padding of 10, vertical padding of 0, and center alignment. Icons must be from Google Icons (weight 200 or 300 (Only for tool bar), optical size 24, no fill).
        </p>
      </div>
      <div className="grid grid-cols-5 gap-6 mt-8">
        {icons.map((icon) => (
          <div key={icon.name} className="flex flex-col items-center">
            <Image src={icon.image} alt={icon.name} />
            <p className="text-white text-sm mt-2">{icon.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Icons;
