import Image from "next/image";
import GolIcon from '../../public/images/icons/gold icon.svg';
import PlatinumIcon from '../../public/images/icons/platinum icon.svg';

interface ButtonsProps {
    styles: { [key: string]: string };
}

const Buttons = ({ styles }: ButtonsProps) => {
    return (
        <section className={styles.section}>
            <div className={styles.headers}>
                <h3 className="text-4xl mb-4">Buttons</h3>
                <p className="text-base">
                    Use auto layout with a rounded square (15° radius), height 42 or 62, flexible width, horizontal padding 37.9, vertical padding 9, and center-aligned text. Frame and text colors must be GBCS Gold Gradient or GBCS Yellow, with a 3px inside stroke. Button text is capitalized, and only the “back” button can have different styles.
                </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="m-auto">
                    <h4 className="text-base mb-3">One Word Button</h4>
                    <div className="flex flex-row gap-3">
                        <button className={`${styles.btn_gradient_gold} text-[25px]`}>
                            Button
                        </button>
                        <button className={`${styles.btn_gradient_platinum} text-[25px]`}>
                            Button
                        </button>
                    </div>
                </div>
                <div className="m-auto">
                    <h4 className="text-base mb-3">Two Words Button</h4>
                    <div className="flex flex-row gap-3">
                        <button className={`${styles.btn_gradient_gold} text-[25px]`}>
                            Bottom Button
                        </button>
                        <button className={`${styles.btn_gradient_platinum} text-[25px]`}>
                            Bottom Button
                        </button>
                    </div>
                </div>
                <div className="m-auto mt-10"> 
                    <h4 className="text-base mb-3">Button With Icon</h4>
                    <div className="flex flex-row gap-3">
                        <button className={`${styles.btn_gradient_gold} flex flex-row gap-2 text-[25px]`}>
                            <Image src={GolIcon} alt="Gold Icon"/>
                            Button
                        </button>
                        <button className={`${styles.btn_gradient_platinum} flex flex-row gap-2 text-[25px]`}>
                            <Image src={PlatinumIcon} alt="Platinum Icon"/>
                            Button
                        </button>
                    </div>
                </div>
                <div className="m-auto mt-10"> 
                    <h4 className="text-base mb-3">Small text - 20px</h4>
                    <div className="flex flex-row gap-3">
                        <button className={`${styles.btn_gradient_gold} text-[20px]`}>
                            Button
                        </button>
                        <button className={`${styles.btn_gradient_platinum} text-[20px]`}>
                            Button
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Buttons;
