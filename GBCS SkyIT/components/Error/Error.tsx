import styles from './Error.module.css';

interface ErrorPageProps {
    error: string | null,
    refetch: () => void;
}

export default function ErrorPage({ error, refetch }: ErrorPageProps) {
    return (
        <div className='grid w-full place-items-center'>
            <div className='w-4/6 flex flex-col gap-3 text-center py-[100px]'>
                <h1 className='text-[#FFE34E] text-9xl'>
                    Error!
                </h1>
                <h2 className='text-2xl text-white'>
                    {error}
                </h2>
                <p className='text-white'>
                    If this issue continues, kindly reach out to the development team for support.
                </p>

                <button
                    className={`mt-5 text-black w-1/5 rounded-lg bg-gradient-gold-gbcs text-[#2F2F2F] ${styles.button_hover_effect} text-base font-normal border-none cursor-pointer py-4 px-10 mx-auto`}
                    onClick={() => refetch()}
                >
                    Refresh the page
                </button>
            </div>
        </div>
    );
}
