import {TeamMember, useTeamData} from "../FormDataContext";
import {useEffect} from "react";

interface ResultListProps {
    results: TeamMember[];
    setUserName: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchResultList: React.FC<ResultListProps> = ({results, setUserName}) => {
    const {selectedResult, setSelectedResults} = useTeamData();
    const handleResultClick = (result: TeamMember) => {
        const index = selectedResult.findIndex((selected) => selected.userEmail === result.userEmail);
        if (index === -1) {
            setSelectedResults([...selectedResult, result]);
            setUserName(result.name);
        } else {
            const newSelectedResults = selectedResult.filter((item) => item.userEmail !== result.userEmail);
            setSelectedResults(newSelectedResults);
        }
    };

    useEffect(() => {
        // console.log("Selected Results:", selectedResult);
    }, [selectedResult]);
    return (
        <div className="w-4/5 bg-zinc-800 d-flex flex-col text-20 py-10 rounded-b-lg">
            {results.map((result, id) => (
                <div
                    key={id}
                    className="hover:bg-zinc-600 py-10 pl-25 rounded"
                    style={{borderBottom: "2px solid gray"}}
                    onClick={() => handleResultClick(result)}
                >
                    {result.displayName}
                </div>
            ))}
        </div>
    );
};
