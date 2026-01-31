import React, { useEffect, useState } from "react";
import { BASEURL } from "../../../constants";
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

interface AddTemplateProps {
    setSelectedItemIndex?: React.Dispatch<React.SetStateAction<number | null>>;
}

interface SelectedTemplate {
    index: number;
    order: number;
}

const AddTemplate: React.FC<AddTemplateProps> = ({ setSelectedItemIndex }) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [section, setSection] = useState<Todo[]>([]);
    const [selectedTemplates, setSelectedTemplates] = useState<SelectedTemplate[]>([]);
    const placeholderCount = Math.max(6 - todos.length, 0);
    const router = useRouter();
    const { proposalID } = router.query;

    // Fetch templates from the API
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
                console.error("Error fetching templates:", error);
            }
        };

        fetchData();
    }, [proposalID]);

    // Toggle template selection and manage ordering
    const toggleSelectTemplate = (index: number) => {
        let updatedSelectedTemplates;
        const existingIndex = selectedTemplates.findIndex(item => item.index === index);

        if (existingIndex !== -1) {
            // If template is already selected, remove it and update the order
            updatedSelectedTemplates = selectedTemplates
                .filter(item => item.index !== index)
                .map((item, i) => ({ ...item, order: i + 1 }));
        } else {
            // Add the new template with the next order number
            updatedSelectedTemplates = [
                ...selectedTemplates,
                { index: index, order: selectedTemplates.length + 1 },
            ];
        }

        setSelectedTemplates(updatedSelectedTemplates);
        setSection(updatedSelectedTemplates.map((item) => todos[item.index]));
    };

    // Handle adding the selected templates to the proposal
    const handleAddTemplate = async () => {
        try {
            const sortedTemplates = [...selectedTemplates].sort((a, b) => a.order - b.order);
            const templateIDs = sortedTemplates.map((item) => todos[item.index].templateID);
            console.log("Templates Order: ", templateIDs)
            const response = await fetch(`${BASEURL}/api/proposal/generate-new-sections`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    proposalID: proposalID,
                    templateID: templateIDs,
                }),
            });

            if (response.ok) {
                if (setSelectedItemIndex) {
                    setSelectedItemIndex(null);
                }
                router.push({
                    pathname: "/edit-proposal",
                    query: { proposalID: proposalID },
                });
            } else {
                console.error("Failed to add section");
            }
        } catch (error) {
            console.error("Error adding templates:", error);
        }
    };

    // Handle cancel operation
    const handleCancelClick = () => {
        if (setSelectedItemIndex) {
            setSelectedItemIndex(null);
        }
        router.push({
            pathname: "/edit-proposal",
            query: { proposalID: proposalID },
        });
    };

    return (
        <div className="absolute right-1 flex flex-col justify-items-end">
            <div className="flex flex-wrap justify-around mt-[8%]">
                {todos.map((todo, index) => (
                    <div className="flex flex-col items-center" key={todo.templateId}>
                        <div className="relative flex items-center justify-center w-[250px] h-[320px] m-4">
                            <div className="w-[46.10px] h-[44.34px] absolute top-2 right-2 z-10 rounded-full">
                                <button
                                    className={`w-[46.10px] h-[44.34px] ${selectedTemplates.some(item => item.index === index) ? "bg-gradient-gold-gbcs" : "bg-white"} border-solid border-2 border-neutral-400 rounded-full`}
                                    onClick={() => toggleSelectTemplate(index)}
                                >
                                    {/* Display the selection order */}
                                    {selectedTemplates.find(item => item.index === index)?.order}
                                </button>
                            </div>
                            <Image src={todo.coverImage.blobUrl} alt="Preview Image" width={250} height={320} />
                        </div>
                        <div className="text-white">
                            {index + 1} - {todo.name}
                        </div>
                    </div>
                ))}
                {/* Placeholder for additional templates */}
                {Array.from({ length: placeholderCount }).map((_, index) => (
                    <div className="relative flex flex-col items-center" key={`placeholder-${index}`}>
                        <div
                            className="flex items-center justify-center w-[250px] h-[320px] opacity-60 m-4 cursor-pointer"
                            style={{
                                backgroundImage:
                                    "linear-gradient(143.88deg, #EBEAEA -0.37%, #BFBFBF 38.34%, #E0E0E0 67.45%, #C3C3C3 96.8%)",
                            }}
                        ></div>
                        <div className="w-[46.10px] h-[44.34px] absolute top-6 right-6 rounded-full">
                            <button className="w-[46.10px] h-[44.34px] bg-white border-solid border-2 border-neutral-500 rounded-full "></button>
                        </div>
                        <div>{index + 1 + todos.length}</div>
                    </div>
                ))}
            </div>
            <div className="flex flex-row justify-end m-[35px] p-3">
                <button
                    className="flex justify-center w-[170px] h-[50px] m-4 mr-4 border-solid border-2 border-gold-gradient-gcbs bg-transparent rounded-xl p-3 text-[#FFE34E] text-3xl font-medium font-poppins items-center"
                    onClick={handleCancelClick}
                >
                    <span className="text-center text-transparent bg-clip-text bg-gradient-gold-gbcs">Cancel</span>
                </button>
                <button
                    className="flex justify-center w-[170px] h-[50px] m-4 border-solid border-2 border-gold-gradient-gcbs bg-transparent rounded-xl p-3 text-[#FFE34E] text-3xl font-medium font-poppins items-center"
                    onClick={handleAddTemplate}
                >
                    <span className="text-center text-transparent bg-clip-text bg-gradient-gold-gbcs">
                        Add
                    </span>
                </button>
            </div>
        </div>
    );
};

export default AddTemplate;