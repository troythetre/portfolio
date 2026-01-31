import React, { useEffect, useState } from "react";
import { BASEURL } from "../../../constants"; // Adjust the path as needed
import Image from "next/image";
import { useRouter } from "next/router";

interface Todo {
    templateID: any;
    coverImage: any;
    templateId: string;
    HTMLContent: string;
    name: string;
    type: string;
    metaData: {
        previewImage: {
            filePath: string;
            type: string;
            url: string;
        };
    };
}
interface Section {
    sectionID: string;
}

interface CreateSectionProps {
    onCloseCreateSection: () => void; // Callback to close modal
    onCreateSection: (newSection: Section) => void;
    updateSection: React.Dispatch<React.SetStateAction<string>>;
    sectionID?: string | null; // Optional prop to get selected section ID
    proposalID?: string | null; // Optional prop to get proposal ID
    sectionUpdated: boolean;
    setSectionUpdated: React.Dispatch<React.SetStateAction<boolean>>;
    errorMessage: (data: string) => void;
    errorDet: (data: boolean) => boolean;
    defError: (data: boolean) => boolean;
}

const CreateSection: React.FC<CreateSectionProps> = ({
    onCloseCreateSection,
    onCreateSection,
    updateSection,
    sectionID,
    proposalID: propProposalID,
    sectionUpdated,
    setSectionUpdated,
    errorMessage,
    errorDet,
    defError
}) => {

    const [todos, setTodos] = useState<Todo[]>([]);
    const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
    const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);
    const [sectionName, setSectionName] = useState<string>("");

    const router = useRouter();
    const { proposalID: queryProposalID } = router.query; // Get proposalID from query if available

    const proposalID = propProposalID || (queryProposalID as string); // Use prop first, fallback to query

    console.log("Selected SEction:", sectionID)
    // Fetch all templates
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASEURL}/api/proposal/get-available-template-list`, {
                    method: "GET",
                    credentials: "include",
                });

                const jsonData = await response.json();
                if (jsonData && jsonData.templates) {
                    const todosArray: Todo[] = Object.values(jsonData.templates);
                    setTodos(todosArray);
                }
            } catch (error) {
                console.error("Fetch error", error);
            }
        };

        fetchData();
    }, [proposalID]);

    const toggleSelectTemplate = (index: number) => {
        if (selectedTemplates.includes(index)) {
            setSelectedTemplates(selectedTemplates.filter((i) => i !== index)); // Deselect
        } else {
            setSelectedTemplates([index]); // Select only one
        }
    };

    // Open the name modal
    const handleNextClick = () => {
        if (selectedTemplates.length === 0) {
            console.error("No template selected");
            return;
        }
        setIsNameModalOpen(true); // Open the modal to enter section name
    };

    // Create a new section with the selected template and entered name
    const handleCreateSection = async () => {
        if (!sectionName) {
            console.error("Section name is required");
            return;
        }

        const templateIDs = selectedTemplates.map((index) => todos[index].templateID);
        console.log("Template IDs:", templateIDs);

        // If a section is selected, use that ID; otherwise, set to null
        const selectedID = sectionID ? sectionID : null;

        try {
            const response = await fetch(`${BASEURL}/api/proposal/generate-new-sections`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    proposalID: proposalID,
                    templateID: templateIDs,
                    sectionName: sectionName, // Send the section name with the request
                    selectedSectionID: selectedID, // Include selected section ID
                }),
            });

            // Check if the response is successful
            if (response.ok) {
                console.log("New section created successfully");
                // setSectionUpdated(!sectionUpdated);
                // Fetch the updated sections list
                const updatedSectionsResponse = await fetch(`${BASEURL}/api/proposal/get-all-sections/${proposalID}`, {
                    method: "GET",
                    credentials: "include",
                });

                const updatedSectionsData = await updatedSectionsResponse.json();
                if (updatedSectionsData && updatedSectionsData.sections) {
                    const newSection = updatedSectionsData.sections.find(
                        (section: Section) => section.sectionID === sectionID
                    );

                    onCreateSection(newSection); // Pass the new section data to parent
                }

                setIsNameModalOpen(false);
                onCloseCreateSection(); // Close the modal

            } else {
                errorDet(true);
                defError(true);
                errorMessage("Error creating section");

                const errorData = await response.json();
                console.error("Error creating section:", errorData.error);
                setIsNameModalOpen(false);
                onCloseCreateSection(); // Close the modal
            }
        } catch (error) {
            console.error("Request error", error);
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className='bg-[#555555] rounded-lg w-[1572px] h-[660px] flex flex-col items-center justify-center p-2'>
                <div className="text-center text-white text-3xl font-bold my-6">Choose a Template</div>
                <div className="flex flex-wrap justify-center items-center overflow-y-auto max-h-[70vh] max-w-[80vw]">
                    {todos.map((todo, index) => (
                        <div className="flex flex-col items-center m-4" key={todo.templateId}>
                            <div className="relative flex items-center justify-center w-[250px] h-[320px]">
                                <div className="absolute top-2 right-2 z-10 rounded-full">
                                    <button
                                        className={`w-[46px] h-[44px] ${selectedTemplates.includes(index) ? "bg-gradient-gold-gbcs" : "bg-white"} border-solid border-2 border-neutral-400 rounded-full`}
                                        onClick={() => toggleSelectTemplate(index)}
                                    ></button>
                                </div>
                                <Image
                                    src={todo.coverImage.blobUrl}
                                    alt="Preview Image"
                                    width={250}
                                    height={320}
                                    className={`rounded-lg ${selectedTemplates.includes(index) ? "" : "opacity-50"}`}
                                />
                            </div>
                            <div className={`text-white mt-2 ${selectedTemplates.includes(index) ? "" : "text-gray-400"}`}>
                                {index + 1} - {todo.name}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-6 space-x-4">
                    <button
                        className="w-[170px] h-[50px] border-solid border-2 border-gold-gradient-gcbs bg-transparent rounded-xl p-3 text-[#FFE34E] text-3xl font-medium"
                        onClick={onCloseCreateSection}
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-gold-gbcs">Cancel</span>
                    </button>
                    <button
                        className="w-[170px] h-[50px] border-solid border-2 border-gold-gradient-gcbs bg-transparent rounded-xl p-3 text-[#FFE34E] text-3xl font-medium"
                        onClick={handleNextClick}
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-gold-gbcs">Next</span>
                    </button>
                </div>
            </div>

            {/* Modal for entering the section name */}
            {isNameModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-[#555555] rounded-lg p-8 w-[600px] h-[300px] flex flex-col items-center justify-center">
                        <h2 className="text-white text-3xl font-bold mb-6">Choose a Name for the Section</h2>
                        <input
                            type="text"
                            value={sectionName}
                            onChange={(e) => setSectionName(e.target.value)}
                            className="border-2 border-gold-gradient-gcbs bg-transparent text-white text-xl w-full p-3 mb-6 rounded-md"
                            placeholder="Enter section name"
                        />
                        <div className="flex justify-center space-x-4">
                            <button
                                className="w-[170px] h-[50px] border-solid border-2 border-gold-gradient-gcbs bg-transparent rounded-xl p-3 text-[#FFE34E] text-3xl font-medium"
                                onClick={() => setIsNameModalOpen(false)} // Close modal without creating
                            >
                                <span className="text-transparent bg-clip-text bg-gradient-gold-gbcs">Cancel</span>
                            </button>
                            <button
                                className="w-[170px] h-[50px] border-solid border-2 border-gold-gradient-gcbs bg-transparent rounded-xl p-3 text-[#FFE34E] text-3xl font-medium"
                                onClick={handleCreateSection}
                            >
                                <span className="text-transparent bg-clip-text bg-gradient-gold-gbcs">Add</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateSection;