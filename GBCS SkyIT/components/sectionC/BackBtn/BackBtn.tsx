import { useRouter } from 'next/router';
import backButton from '../../../public/images/commentsPopUp/icon_arrow_back_circle_sharp.png';
import Image from 'next/image';

const BackBtn: React.FC = () => {
  const router = useRouter();

  const handleBackButtonClick = () => {
    router.back();
  };

  return (
    <button
      type="button"
      onClick={handleBackButtonClick}
      className=" border-none bg-transparent cursor-pointer mr-[20px] mt-[0px] mb-[20px]"
    >
      <Image src={backButton} alt="back-button" width={53} height={53} />
    </button>
  );
};

export default BackBtn;
