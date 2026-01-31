import Image from "next/image";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Card({ name, noImage, edit, modifyUser }: any) {
    let timeString = '';

    if (edit < 7) {
        timeString = `${edit}d`;
    } else if (edit < 30) {
        const weeks = Math.floor(edit / 7);
        timeString = `${weeks}w`;
    } else if (edit < 365) {
        const months = Math.floor(edit / 30.44); // Average number of days in a month
        timeString = `${months}m`;
    } else {
        const years = Math.floor(edit / 365.25); // Average number of days in a year
        timeString = `${years}y`;
    }
    
    // Construct the default avatar URL using the ui-avatars API
    const avatarURL = modifyUser.photoURL

    return (
        <div className="rounded-lg h-48 w-2/12 md:w-3/12 lg:w-2/12">
            <div className="h-40 bg-white rounded-t-lg flex justify-center items-center">
                {
                    // if the image is the default image we will use the icon instead so it doesn't look broken
                    noImage.src === "https://example.com/proposal" ? (
                        <InsertPhotoIcon 
                            sx={{ height: 60, width: 60 }}
                            className="text-[#2F2F2F]"
                        />
                    ) : (
                        <Image src={noImage} alt="noImage" width="50" height="50"/>
                    )
                }
            </div>

            <div className="bg-[#555] rounded-b-lg px-4">
                <p>{name}</p>

                <div className="hidden md:flex gap-1 py-4 items-center">
                    {
                        // Display user photo or generate avatar if not available
                        <div className="relative w-8 h-8">
                            <Image 
                                src={avatarURL} 
                                alt="User Photo" 
                                layout="fill" 
                                objectFit="cover" 
                                className="rounded-full"
                            />
                        </div>
                    }
                    <div className="flex gap-1.5 items-center">
                        <p className="text-medium text-[12px] text-zinc-400">
                            {
                                modifyUser.name === undefined ? "N/A" :
                                modifyUser.name.split(" ")[0]
                            }
                        </p>

                        <div className="flex items-start">
                            <div className="h-0.5 w-0.5 rounded-full bg-zinc-400"></div>
                        </div>

                        <p className="text-thin text-[10px] text-zinc-400 pt-2">{timeString} ago edited</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
