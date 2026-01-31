import DropDownMenu from "./patialComp/DropDownMenu/DropDownMenu";
import Card from "./patialComp/Card";
import Info from "./patialComp/Info";

function DetailRfpComp({ id, onClick, name, date, edit, percent, noImage, modifyUser, ProposalDetails, setProposalDetails, openMenuId, handleMenuToggle }) {
    // console.log("percet", percent, date, name);

    return (
        <>
            <div className="text-white z-100 pt-12 flex pb-24 w-full px-8">
                <Card name={name} noImage={noImage} edit={edit} modifyUser={modifyUser} />
                <div className="basis-full">
                    <Info id={id} name={name} percent={percent} edit={edit} date={date} onClick={onClick}
                        ProposalDetails={ProposalDetails}
                        setProposalDetails={setProposalDetails}
                        isMenuOpen={openMenuId === id}
                        handleMenuToggle={handleMenuToggle} />
                    <DropDownMenu id={id} date={date} />
                </div>
            </div>
        </>
    );
}
export default DetailRfpComp;
