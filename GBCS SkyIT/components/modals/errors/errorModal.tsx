import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { set } from 'date-fns';


export default function errorModal({errorMessage, fourOhOne, setFourOhOne, setErrorDet, defError, setDefError}) {
    // Error Message will be the message you want to display in the modal
    // fourOhOne will be included if the error is related to the user not being authenticated which you can trigger with true and false but if you do will also need to set defError to false
    // defError will be the default button to close the error modal

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-[400px] p-12 rounded-lg bg-zinc-700 shadow-lg">

                <div className="flex gap-4 items-center mb-4">
                    <WarningRoundedIcon 
                    sx={{
                        fontsize: 30,
                    }}
                    className="text-yellow-400 h-full shadow-lg"
                    />
                    <div className="text-xl font-semibold text-yellow-400 font-poppins">Error</div>
                </div>

                <div className="">{errorMessage}</div>

                {/* 401 auth token button */}
                { 
                fourOhOne &&
                    <div className="flex justify-center border border-solid border-r-0 border-l-0 border-b-0 mt-4 border-zinc-600">
                        <button 
                        className="cursor-pointer border-solid border border-yellow-400 bg-inherit text-yellow-400 px-[24px] py-4 rounded-lg mt-4 hover:bg-gradient-text hover:text-black transition-all duration-300" 
                        onClick={() => {
                            window.location.href = "/login"
                            setErrorDet(false)
                            setFourOhOne(false)
                            setDefError(true)
                        }}
                        >
                            Login
                        </button>
                    </div>
                }

                {/* default error button */}
                { 
                defError &&
                    <div className="flex justify-center border border-solid border-r-0 border-l-0 border-b-0 mt-4 border-zinc-600">
                        <button 
                        className="cursor-pointer border-solid border border-yellow-400 bg-inherit text-yellow-400 px-[24px] py-4 rounded-lg mt-4 hover:bg-gradient-text hover:text-black transition-all duration-300" 
                        onClick={() => {
                            setErrorDet(false)
                        }}
                        >
                            Close
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}