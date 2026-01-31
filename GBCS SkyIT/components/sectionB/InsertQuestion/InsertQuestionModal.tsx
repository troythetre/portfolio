import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../../sectionC/AdminComponent/AdminLibraryResponse/styles.module.css';
import { BASEURL } from '../../../constants';

type Props = {
    sectionID: string;
}

const InsertQuestionModal = ({ sectionID }: Props) => {

    const router = useRouter();
    const { proposalID } = router.query;

    const [questionsOnProposal, setQuestionsOnProposal] = useState([{ question: '' }]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allQuestions = await axios.get(`${BASEURL}/api/proposal/questions/${proposalID}`, {
                    withCredentials: true,
                });

                setQuestionsOnProposal(allQuestions.data.questions)

            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    console.log("No Current Questions");
                }
                else if (error.response && error.response.status === 401) {
                    console.log("Invalid authentication token or expired token. Please login again.");

                } else {
                    console.log("An unknown error occurred. Please try again later.");
                }
            }
        };
        fetchData();
    }, []);

    const handleAddQuestion = (q: string): void => {

        const selectedPage = document.getElementById(`page-${sectionID}`);
        const selectedDiv = selectedPage?.getElementsByClassName("question");
        if (selectedDiv) {
            let questionDiv = selectedDiv[0].childNodes[0].childNodes[0];
            questionDiv.textContent = q;
        } else {
            console.log('No valid target found');
        }

    };

    return (
        <>
            <div className='w-[500px] h-max-[500px] overflow-auto relative bg-black rounded-xl p-10 '>
                <table
                    className={`mt-0 ml-0 mr-0 border-2 border-collapse border-gray-500 table-auto border-solid transactionHistory ${styles.transactionHistory}`}
                    style={{ tableLayout: 'fixed', width: '100%' }}
                >
                    <thead className="border-solid border-t border-b">
                        <tr className=" text-22 font-poppins font-semibold  ">

                            <th className="border-t-2 border-b-0 text-center p-4 bg-clip-text bg-gradient-text text-transparent  ">
                                Question
                            </th>

                            <th className="border-t-0 border-b-0 text-center p-5 bg-clip-text bg-gradient-text text-transparent">
                                {/* Empty cell */}
                            </th>

                        </tr>
                    </thead>
                    <tbody className="border-solid border-collapse border-t border-b">

                        {questionsOnProposal.map((q, indx) => (
                            <tr key={`Q index-${indx}`} className="border-solid text-white-color">
                                <td className="border-t-0 border-b-2 border-white text-center p-5 font-poppins color-white">
                                    {q.question}
                                </td>
                                <td className='h-full w-full text-center'>
                                    <button
                                        className=" w-[200px] h-[42px] rounded-2xl bg-black border-solid border-2 border-gold-gradient-gcbs bg-transparent text-[#FFE34E] text-md font-sans font-bold"
                                        onClick={() => handleAddQuestion(q.question)}>
                                        <span className="text-[20px] text-center text-transparent bg-clip-text bg-gradient-gold-gbcs">Add Question</span>
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div >

        </>
    );
}

export default InsertQuestionModal