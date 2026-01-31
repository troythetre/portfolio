import React, { useState, useRef, useEffect } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import styles from "./grid.module.css";
import Image from "next/image";
import { BASEURL } from "../../../constants/index";
import axios from "axios";
import EditPermission from "../Account/EditPermission";
import AddNewUser from "../Account/AddNewUser";
import ErrorModal from "../../modals/errors/errorModal";
import Typography from "@mui/material/Typography";

const MultiselectDropdown = ({
    rowIndex,
    onDelete,
    zIndex,
    permissionOptions,
    selectedPermissions,
    editingMode,
    onPermissionsChange,
    toggleEditingMode,
}) => {
    const options = permissionOptions || [];
    const [selectedItems, setSelectedItems] = useState(selectedPermissions || []);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // console.log(editingMode);

    const toggleDropdown = () => {
        if (options.length > 0 && editingMode === true) {
            setDropdownOpen(!dropdownOpen);
        }
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };
    const handleCheckboxChange = (option) => {
        console.log(selectedItems);
        if (editingMode) {
            const updatedPermissions = selectedItems.includes(option)
                ? selectedItems.filter((perm) => perm !== option)
                : [...selectedItems, option];

            setSelectedItems(updatedPermissions);
            console.log(selectedItems);

            onPermissionsChange(updatedPermissions);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={dropdownRef}
            className="relative inline-block"
            style={{ zIndex: zIndex, boxShadow: "0 2px 2px #FFE34E" }}
        >
            <button
                onClick={toggleDropdown}
                className={`${styles.dropdownButton} bg-primary-gbcs-black border border-gray-300 p-2 w-[70%] rounded-md focus:outline-none text-center flex items-center justify-between`}
            >
                <span className="mr-2">
                    {selectedItems.length === 0
                        ? options.length > 0
                            ? "Select options"
                            : null
                        : selectedItems.join(", ")}
                </span>
                <ArrowDropDownIcon className={styles.greyArrow} />
            </button>
            {dropdownOpen && (
                <div className="absolute top-10 right-0 mt-2 bg-primary-gbcs-black p-2 rounded-md shadow-md min-w-[26rem] text-left">
                    {permissionOptions &&
                        permissionOptions
                            .filter((option) => option) // Filter out falsy values
                            .map((option, index) => (
                                <label
                                    key={index}
                                    className="block cursor-pointer mb-4"
                                    style={{ borderBottom: "2px solid gray" }}
                                >
                                    {editingMode ? ( // Check if editingMode is true
                                        <input
                                            type="checkbox"
                                            value={option}
                                            checked={selectedItems.includes(option)}
                                            onChange={() => handleCheckboxChange(option)}
                                            className="hidden"
                                            // disable="false"
                                            disabled={!editingMode}
                                        />
                                    ) : (
                                        <input
                                            type="checkbox"
                                            value={option}
                                            checked={selectedItems.includes(option)}
                                            disabled // Make checkbox read-only when editingMode is false
                                            className="hidden"
                                        />
                                    )}

                                    <span className="ml-2" style={{ minWidth: "24px", display: "inline-block" }}>
                                        {selectedItems.includes(option) ? (
                                            <Image src="/../tick.svg" alt="Tick" width={24} height={24} />
                                        ) : (
                                            <div className="w-4 h-4 border border-gray-400"></div>
                                        )}
                                    </span>
                                    {option}
                                </label>
                            ))}
                </div>
            )}
        </div>
    );
};

const RedGridTable = () => {
    const [teamMemberList, setTeamMemberList] = useState([]);
    const [permissionOptions, setPermissionOptions] = useState([]);
    const [editingMode, setEditingMode] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [rowToDelete, setRowToDelete] = useState(null);
    // sets the amout of pages to display for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // splices the teamMemberList array and allows for page changing
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = teamMemberList.slice(indexOfFirstItem, indexOfLastItem);
    // error modal states
    const [errorDet, setErrorDet] = useState(false);
    const [fourOhOne, setFourOhOne] = useState(false);
    const [defError, setDefError] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const toggleEditingMode = () => {
        setEditingMode((prevMode) => !prevMode);

        if (!editingMode) {
            window.alert("Editing mode activated.");
        } else {
            window.alert("Editing mode locked.");
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASEURL}/api/proposal/all-users`, {
                    withCredentials: true,
                });

                const receivedData = response.data || [];
                setTeamMemberList(receivedData);
                const permissionOptions = Array.from(new Set(receivedData.flatMap((user) => user.permissions)));
                setPermissionOptions(permissionOptions);
            } catch (error) {
                // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                if (error.response && error.response.status === 401) {
                    setErrorMessage("Invalid authentication token or expired token. Please login again.");
                    setErrorDet(true);
                    setFourOhOne(true);
                    setDefError(false);
                } else {
                    setErrorMessage("An unknown error occurred. Please try again later.");
                    setErrorDet(true);
                    setDefError(true);
                    setFourOhOne(false);
                }
                // To use the dummy data for testing, uncomment the following lines
                // let testData = require('./dummyData.json');
                // console.log(testData.Users);
                // const receivedData = testData.Users || [];
                // setTeamMemberList(receivedData);
            }
        };
        //console.log(editingMode)
        fetchData();
    }, [teamMemberList]);

    const confirmDelete = async () => {
        if (userToDelete !== null && rowToDelete !== null) {
            try {
                const payload = { email: userToDelete };

                const response = await axios.delete(`${BASEURL}/api/proposal/delete-user`, {
                    withCredentials: true,
                    data: payload,
                });

                window.alert("User deleted successfully");
                const resp = response.data;
                console.log(resp);
                // const updatedTeamMemberList = [...teamMemberList];
                // updatedTeamMemberList.splice(rowToDelete, 1);
                // setTeamMemberList(updatedTeamMemberList);
                setShowPopup(false);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setErrorMessage("Invalid authentication token or expired token. Please login again.");
                    setErrorDet(true);
                    setFourOhOne(true);
                    setDefError(false);
                } else {
                    setErrorMessage("An unknown error occurred. Please try again later.");
                    setErrorDet(true);
                    setDefError(true);
                    setFourOhOne(false);
                }
            }
        }
    };

    const handleDeleteClick = (rowIndex, userEmail) => {
        setUserToDelete(userEmail);
        setRowToDelete(rowIndex);
        setShowPopup(true);
    };

    const cancelDelete = () => {
        setShowPopup(false);
        setUserToDelete(null);
        setRowToDelete(null);
    };

    const handlePermissionsChange = async (permissions, userEmail) => {
        try {
            const payload = {
                userEmail: userEmail,
                permissions: permissions,
            };

            const updatedTeamMemberList = teamMemberList.map((member) => {
                if (member.userEmail === userEmail) {
                    return {
                        ...member,
                        permissions: permissions,
                    };
                }
                return member;
            });

            // Update permissions for all team members in the state
            setTeamMemberList(updatedTeamMemberList);
            console.log(teamMemberList);
            const response = await axios.put(`${BASEURL}/api/proposal/user/update-permissions`, payload, {
               withCredentials: true,
            });
            console.log("Permissions updated successfully:", response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Invalid authentication token or expired token. Please login again.");
                setErrorDet(true);
                setFourOhOne(true);
                setDefError(false);
            } else {
                setErrorMessage("An unknown error occurred. Please try again later.");
                setErrorDet(true);
                setDefError(true);
                setFourOhOne(false);
            }
        }
    };

    return (
        <div>
            {errorDet && (
                <div className="fixed z-10 top-0 left-0 w-full h-full flex items-center bg-black bg-opacity-50 backdrop-blur">
                    <ErrorModal
                        errorMessage={errorMessage}
                        fourOhOne={fourOhOne}
                        setFourOhOne={setFourOhOne}
                        setErrorDet={setErrorDet}
                        defError={defError}
                        setDefError={setDefError}
                    />
                </div>
            )}
            {showPopup && (
                <dialog className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
                    <div className="w-[450px] h-[200px] rounded-[15px] bg-[#555555] shadow-lg relative">
                        <div className="flex flex-col items-center text-white py-[30px]">
                            <br></br>
                            <Typography
                                display={"flex"}
                                align={"center"}
                                color={"F4F2F2"}
                                font-family="Poppins"
                                fontSize={25}
                                font-style="normal"
                                fontWeight={400}
                                lineHeight={"41px"}
                                letterSpacing={0.375}
                            >
                                Are you sure you want to delete this user?
                            </Typography>
                            <br />

                            <div className="flex px-[30px] gap-[45px]">
                                <button
                                    type="button"
                                    className="flex h-[35px] bg-inherit border-solid border-2 border-GBCS-yellow rounded-[5px] text-GBCS-yellow px-6 py-4 rounded-x1  hover:text-black hover:mantine-Text-root hover:bg-gradient-border "
                                    onClick={cancelDelete}
                                >
                                    {" "}
                                    <Typography
                                        display={"flex"}
                                        color={"F4F2F2"}
                                        font-family="Poppins"
                                        fontSize={15}
                                        font-style="bold"
                                        fontWeight={400}
                                        lineHeight={"25px"}
                                        letterSpacing={0.375}
                                    >
                                        Cancel{" "}
                                    </Typography>
                                </button>

                                <button
                                    type="button"
                                    className="flex h-[35px] bg-inherit border-solid border-2 border-GBCS-yellow rounded-[5px] text-GBCS-yellow px-6 py-4 rounded-x1  hover:text-black hover:mantine-Text-root hover:bg-gradient-border "
                                    onClick={confirmDelete}
                                >
                                    {" "}
                                    <Typography
                                        display={"flex"}
                                        color={"F4F2F2"}
                                        font-family="Poppins"
                                        fontSize={15}
                                        font-style="bold"
                                        fontWeight={400}
                                        lineHeight={"25px"}
                                        letterSpacing={0.375}
                                    >
                                        Confirm
                                    </Typography>
                                </button>
                            </div>
                        </div>
                    </div>
                </dialog>
            )}

            <div className="flex flex-col">
                <div className="flex justify-end mr-4 absolute top-[19%] right-5">
                    <div className="relative" style={{ zIndex: 2 }}>
                        <AddNewUser />
                        <EditPermission toggleEditingMode={toggleEditingMode} />
                    </div>
                </div>
                <div className="w-[90%] relative" style={{ zIndex: 1 }}>
                    <table className={`${styles["red-grid-table"]} mt-8 ml-2`}>
                        <thead>
                            <tr>
                                <th className={`text-center ${styles["small-column"]}`}>
                                    -{/* <img src="/../minus.svg" alt="Image" /> */}
                                </th>
                                <th className={`text-GBCS-yellow text-center ${styles["middel-column"]}`}>Name</th>
                                <th className={`text-GBCS-yellow text-center ${styles["middel-column"]} `}>Email</th>
                                <th className={`text-GBCS-yellow text-center ${styles["middel-column"]}`}>Role</th>
                                <th className={`text-GBCS-yellow text-center ${styles["large-column"]}`}>
                                    Permissions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 &&
                                currentItems.map((teamMember, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td className={`${styles.border} ${styles.px4} ${styles.py2} text-center`}>
                                            <img
                                                src="/../minus.svg"
                                                alt="Delete"
                                                onClick={() => handleDeleteClick(rowIndex, teamMember.userEmail)}
                                                style={{ cursor: "pointer", marginTop: "5px" }}
                                            />
                                        </td>
                                        <td className={`${styles.border} ${styles.px4} ${styles.py2} text-center`}>
                                            {teamMember.displayName || "N/A"}
                                        </td>
                                        <td className={`${styles.border} ${styles.px4} ${styles.py2} text-center`}>
                                            {teamMember.userEmail}
                                        </td>
                                        <td className={`${styles.border} ${styles.px4} ${styles.py2} text-center`}>
                                            {teamMember.role}
                                        </td>
                                        <td className={`${styles.border} ${styles.px4} ${styles.py2} text-center`}>
                                            <MultiselectDropdown
                                                rowIndex={rowIndex}
                                                onDelete={() => deleteData(rowIndex, teamMember.userEmail)}
                                                zIndex={1000 - rowIndex}
                                                permissionOptions={permissionOptions}
                                                selectedPermissions={teamMember.permissions}
                                                editingMode={editingMode}
                                                onPermissionsChange={(permissions) =>
                                                    handlePermissionsChange(permissions, teamMember.userEmail)
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <div className="my-8 flex gap-8 justify-center">
                        <button
                            className="border border-solid bg-inherit border-gold-gradient-gcbs h-[42px] w-[128px] rounded-xl text-yellow-300 hover:bg-zinc-700"
                            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                        >
                            Previous
                        </button>

                        <button
                            className="border border-solid bg-inherit border-gold-gradient-gcbs h-[42px] w-[128px] rounded-xl text-yellow-300 hover:bg-zinc-700"
                            onClick={() =>
                                setCurrentPage(
                                    currentPage < Math.ceil(teamMemberList.length / itemsPerPage)
                                        ? currentPage + 1
                                        : currentPage
                                )
                            }
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RedGridTable;
