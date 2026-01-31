import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LoaderOne } from "../components/Loader/LoaderOne";
import styles from "../components/LoginComponent/login.module.css";

interface ErrorPageProps {
    code?: string;
    title?: string;
    message?: string;
}

const ErrorPage = () => {
    const router = useRouter();
    const { code, title, message } = router.query;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [errorData, setErrorData] = useState<ErrorPageProps>({
        code: "",
        title: "",
        message: "",
    });

    const formattedTitle = errorData.code?.trim()
        ? `${errorData.code} - ${errorData.title || "Error"}`
        : errorData.title || "Error";

    useEffect(() => {
        if (router.isReady) {
            setErrorData({
                code: code as string,
                title: title as string,
                message: message as string,
            });
        }
    }, [router.isReady, code, title, message]);

    const handleBtnClick = async () => {
        setIsLoading(true);
        await router.push("/login");
        setIsLoading(false);
    }

    return (
        <div className="flex justify-center items-center w-screen h-screen bg-background-login-error bg-no-repeat bg-cover">
            <div className="flex flex-col gap-10">
                <div className={`${styles.text_font} flex flex-col gap-8 py-[80px] px-[100px] max-w-4xl rounded-lg text-white shadow-3xl text-center bg-black/50`}>
                    <h1 className="text-5xl font-normal">{formattedTitle}</h1>
                    <p className="text-lg font-bold px-[50px]">
                        {errorData.message || "Please try again later or contact support."}
                    </p>
                </div>
                <button
                    onClick={handleBtnClick}
                    className={`${styles.text_font} ${styles.button_hover_effect} bg-gradient-gold-gbcs text-[#2F2F2F] border-none cursor-pointer m-auto font-bold px-[40px] py-[10px] rounded-lg max-w-fit`}
                >
                    BACK TO LOGIN PAGE
                </button>
            </div>

            {isLoading && <LoaderOne />}
        </div>
    );
};

export default ErrorPage;
