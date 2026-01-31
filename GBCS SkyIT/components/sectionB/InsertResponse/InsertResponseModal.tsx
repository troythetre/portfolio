import InsertResponseLibrary from '../InsertResponseLibrary/InsertResponseLibrary';

type ResponseDiv = {
    div: HTMLElement,
    active: boolean,
}

type Props = {
    sectionID: string;
    responsiveDivs: ResponseDiv[];
}

const InsertResponseModal = ({ sectionID, responsiveDivs }: Props) => {
    return (
        <>
            <div className='w-[800px] relative bg-black rounded-xl px-10 py-3 overflow-auto '>
                <div className="w-full text-transparent bg-clip-text bg-gradient-gold-gbcs text-3xl font-poppins font-bold mb-5 ">
                    Insert a Response
                </div>
                <InsertResponseLibrary sectionID={sectionID} responsiveDivs={responsiveDivs} />
            </div>
        </>
    );
}

export default InsertResponseModal