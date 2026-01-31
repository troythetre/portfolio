import Image from "next/image";
import styles from "./styleguide.module.css";
import logo from "../../public/images/login/logo_login.svg"
import Colors from "../../components/StyleGuide/Colors";
import Typography from "../../components/StyleGuide/Typography";
import Icons from "../../components/StyleGuide/Icons";
import Buttons from "../../components/StyleGuide/Buttons";
import FigmaImage from '../../public/images/Figma Wireframe.png';
import FrontendDoc from '../../public/images/Frontend doc.png';
import GoogleDrive from '../../public/images/Google Drive.png';
import Link from "next/link";

const StyleGuide = () => {
    return (
        <>
            <header className="flex flex-row justify-between items-center py-[50px] px-[200px] bg-black font-['Poppins']">
                <div className="max-w-[500px]">
                    <h2 className="text-base">VOOP</h2>
                    <h1 className="text-7xl">Style Guide</h1>
                    <p className="text-xl mt-5">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                    </p>
                </div>
                <Image src={logo} alt="Voop Logo" height={300} />
            </header>

            <main className="font-['Poppins']">
                <Colors styles={styles} />
                <Typography styles={styles} />
                <Icons styles={styles} />
                <Buttons styles={styles} />
            </main>

            <footer className="flex flex-col bg-black font-['Poppins'] py-[50px] px-[200px] text-center">
                <h3 className="text-4xl mb-10">Important Links</h3>
                <div className="flex flex-row gap-6 m-auto">
                    <Link
                        href="https://www.figma.com/design/DCOujn2Ngt1DfBRXVf5TsB/Voop-Wireframe?node-id=6507-6186&t=5Wu35GpDdGUt2KCZ-0"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <a className="flex flex-col gap-5 items-center">
                            <span className={`${styles.span} hover:underline`}>
                                Figma Wireframe
                            </span>
                            <Image
                                src={FigmaImage}
                                alt="Figma Screenshot"
                                width={200}
                                height={120}
                            />
                        </a>
                    </Link>

                    <Link
                        href="https://docs.google.com/document/d/1P2RgRCp0oWlvMZ70fC1mW5Y9hY04a74M44al5hxlnQ0/edit?pli=1&tab=t.0"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <a className="flex flex-col gap-5 items-center">
                            <span className={`${styles.span} hover:underline`}>
                                Frontend Documentation
                            </span>
                            <Image
                                src={FrontendDoc}
                                alt="Frontend Documentation Screenshot"
                                width={200}
                                height={120}
                            />
                        </a>
                    </Link>

                     <Link
                        href="https://drive.google.com/drive/u/2/folders/1A5QpO7zrq5ll8nDqpCv4FwwKJfLyNEsC"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <a className="flex flex-col gap-5 items-center">
                            <span className={`${styles.span} hover:underline`}>
                                Voop Google Drive
                            </span>
                            <Image
                                src={GoogleDrive}
                                alt="Google Drive Screenshot"
                                width={200}
                                height={120}
                            />
                        </a>
                    </Link>
                </div>
            </footer>

        </>
    )
}

export default StyleGuide;