import Image from 'next/image';
import emptyBox from '../../public/images/empty-box.svg'

export default function NoFeedbacks() {
    return (
        <div className='grid w-full place-items-center'>
            <div className='w-4/6 flex flex-col gap-5 text-center py-[100px]'>
                <div className="m-auto flex flex-row gap-4 items-center">
                    <Image src={emptyBox} alt='Empty box' width={150} height={150} />
                    <h1 className='text-[#FFE34E] text-5xl'>
                        No feedback available
                    </h1>
                </div>
                <p className='text-white text-xl'>
                    You haven’t received any feedback yet. Please check back later.
                </p>
            </div>
        </div>

    );
}
