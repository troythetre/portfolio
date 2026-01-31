import React, { createContext, ReactNode, useContext, useState } from "react";

// Define interfaces for your data types
interface UserContextProps {
    userEmail: string | null;
    photoURL: string | null;
    displayName: string | null;
    role: string | null;
}

interface UserContextType {
    user: UserContextProps;
    setUser: React.Dispatch<React.SetStateAction<UserContextProps>>;
}

interface FormData {
    proposalName: string;
    clientName1: string;
    clientName2: string;
}

export interface TeamMember {
    userEmail: any;
    displayName: ReactNode;
    name: string;
    email: string;
    photoURL?: string;
}

interface ProposalNumber {
    proposalID: string;
}

interface ProposalDeadline {
    proposalDeadline: Date | null;
}

interface DropdownItemSelected {
    proposalMedium: string;
    companyType: string;
    companyName: string;
    softwareName: string;
    companyColor: string;
}

interface UserSelectedColor {
    userColorSelection: string[];
}

interface CompanySelectedColor {
    companyColorSelection: string[];
}

interface DateSelected {
    identifier: string;
    date: Date | null;
}

// Define context types
interface FormDataContextType {
    formData1: FormData;
    setFormData1: React.Dispatch<React.SetStateAction<FormData>>;
}

interface TeamMemberContextType {
    selectedResult: TeamMember[];
    setSelectedResults: React.Dispatch<React.SetStateAction<TeamMember[]>>;
}
interface ProposalNumberContextType {
    proposalID: ProposalNumber;
    setProposalID: React.Dispatch<React.SetStateAction<ProposalNumber>>;
}
interface UserSelectedColorContextType {
    clientColor: UserSelectedColor;
    setClientColor: React.Dispatch<React.SetStateAction<UserSelectedColor>>;
}

interface CompanySelectedColorContextType {
    companyColor: CompanySelectedColor;
    setCompanyColor: React.Dispatch<React.SetStateAction<CompanySelectedColor>>;
}

interface FormDataDatesContextType {
    dates: DateSelected[];
    setDates: React.Dispatch<React.SetStateAction<DateSelected[]>>;
}

interface FormDataDropdownContextType {
    dropdownValues: DropdownItemSelected;
    setDropdownValues: React.Dispatch<React.SetStateAction<DropdownItemSelected>>;
}

interface FormDataDeadlineValueContextType {
    proposalDeadline: ProposalDeadline;
    setDeadline: React.Dispatch<React.SetStateAction<ProposalDeadline>>;
}

interface FormDataProviderProps {
    children: React.ReactNode;
}

interface ImageContextType {
    imageFile: File | null;
    setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
}
// Create contexts
const UserContext = createContext<UserContextType | undefined>(undefined);
const FormDataContext = createContext<FormDataContextType | undefined>(undefined);
const FormDataDatesContext = createContext<FormDataDatesContextType | undefined>(undefined);
const FormDropdownValuesContext = createContext<FormDataDropdownContextType | undefined>(undefined);
const FormDataDeadlineValueContext = createContext<FormDataDeadlineValueContextType | undefined>(undefined);
const UserSelectedColorContext = createContext<UserSelectedColorContextType | undefined>(undefined);
const CompanySelectedColorContext = createContext<CompanySelectedColorContextType | undefined>(undefined);
const TeamMemberContext = createContext<TeamMemberContextType | undefined>(undefined);
const ProposalNumberContext = createContext<ProposalNumberContextType | undefined>(undefined);
const ImageContext = createContext<ImageContextType | undefined>(undefined);

// Custom hooks to consume contexts
export const useFormData = () => {
    const context = useContext(FormDataContext);
    if (!context) {
        throw new Error("useFormData must be used within a FormDataProvider");
    }
    return context;
};

export const useTeamData = () => {
    const context = useContext(TeamMemberContext);
    if (!context) {
        throw new Error("useTeamData must be used within a FormDataProvider");
    }
    return context;
};

export const useProposalID = () => {
    const context = useContext(ProposalNumberContext);
    if (!context) {
        throw new Error("useProposalID must be used within a FormDataProvider");
    }
    return context;
};

export const useClientColor = () => {
    const context = useContext(UserSelectedColorContext);
    if (!context) {
        throw new Error("useClientColor must be used within a FormDataProvider");
    }
    return context;
};

export const useCompanyColor = () => {
    const context = useContext(CompanySelectedColorContext);
    if (!context) {
        throw new Error("useCompanyColor must be used within a FormDataProvider");
    }
    return context;
};

export const useFormDates = () => {
    const context = useContext(FormDataDatesContext);
    if (!context) {
        throw new Error("useFormDates must be used within a FormDataProvider");
    }
    return context;
};

export const useFormDropdown = () => {
    const context = useContext(FormDropdownValuesContext);
    if (!context) {
        throw new Error("useFormDropdown must be used within a FormDataProvider");
    }
    return context;
};

export const useFormDeadline = () => {
    const context = useContext(FormDataDeadlineValueContext);
    if (!context) {
        throw new Error("useFormDeadline must be used within a FormDataProvider");
    }
    return context;
};

export const useImageFile = () => {
    const context = useContext(ImageContext);
    if (!context) {
        throw new Error("useImageFile must be used within a FormDataProvider");
    }
    return context;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a FormDataProvider");
    }
    return context;
};

// Provider component to wrap the application
export const FormDataProvider: React.FC<FormDataProviderProps> = ({ children }) => {
    // Initialize state for each context
    const [formData1, setFormData1] = useState<FormData>({
        proposalName: "",
        clientName1: "",
        clientName2: "",
    });
    const [selectedResult, setSelectedResults] = useState<TeamMember[]>([]);

    const [proposalID, setProposalID] = useState<ProposalNumber>({ proposalID: "" });

    const [clientColor, setClientColor] = useState<UserSelectedColor>({
        userColorSelection: [],
    });

    const [companyColor, setCompanyColor] = useState<CompanySelectedColor>({
        companyColorSelection: [],
    });

    const [dates, setDates] = useState<DateSelected[]>([
        { identifier: "research", date: null },
        { identifier: "review", date: null },
        { identifier: "plan", date: null },
        { identifier: "teamOpt", date: null },
        { identifier: "ansDraft", date: null },
        { identifier: "submission", date: null },
        { identifier: "finalisation", date: null },
        { identifier: "teamReview", date: null },
    ]);

    const [dropdownValues, setDropdownValues] = useState<DropdownItemSelected>({
        proposalMedium: "",
        companyType: "",
        companyName: "",
        softwareName: "",
        companyColor: "",
    });

    const [proposalDeadline, setDeadline] = useState<ProposalDeadline>({
        proposalDeadline: null,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [user, setUser] = useState<UserContextProps>({
        userEmail: null,
        photoURL: null,
        displayName: null,
        role: null,
    });

    // Provide contexts with their respective values
    return (
        <UserContext.Provider value={{ user, setUser }}>
            <FormDataContext.Provider value={{ formData1, setFormData1 }}>
                <FormDataDatesContext.Provider value={{ dates, setDates }}>
                    <FormDropdownValuesContext.Provider value={{ dropdownValues, setDropdownValues }}>
                        <FormDataDeadlineValueContext.Provider value={{ proposalDeadline, setDeadline }}>
                            <UserSelectedColorContext.Provider value={{ clientColor, setClientColor }}>
                                <CompanySelectedColorContext.Provider value={{ companyColor, setCompanyColor }}>
                                    <TeamMemberContext.Provider value={{ selectedResult, setSelectedResults }}>
                                        <ProposalNumberContext.Provider value={{ proposalID, setProposalID }}>
                                            <ImageContext.Provider value={{ imageFile, setImageFile }}>
                                                {children}
                                            </ImageContext.Provider>
                                        </ProposalNumberContext.Provider>
                                    </TeamMemberContext.Provider>
                                </CompanySelectedColorContext.Provider>
                            </UserSelectedColorContext.Provider>
                        </FormDataDeadlineValueContext.Provider>
                    </FormDropdownValuesContext.Provider>
                </FormDataDatesContext.Provider>
            </FormDataContext.Provider>
        </UserContext.Provider>
    );
};
