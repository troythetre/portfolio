type Props = {
    sectionID: string;
    questionList: string[];
}

const SectionQuestionList = ({ sectionID, questionList }: Props) => {
    return (
        <div>
            {(questionList.length) < 1 ? (
                <div className=" flex justify-start w-full text-xs pl-10 py-10 text-gray-200">No associated questions</div>) :
                <ul className="text-xs text-gray-200 my-2 -ml-4">
                    {questionList.map(((q, inx) => (
                        <li key={`section-${sectionID}-question-${inx}`} className="py-1">
                            {q}
                        </li>
                    )))}
                </ul>
            }
        </div>
    )
}

export default SectionQuestionList