import edit from "../../public/images/button/edit_icon.svg"
import archive from "../../public/images/button/archive_icon.svg"
import exportIcon from "../../public/images/button/export_icon.svg"
import Image from "next/image";

function SearchButton(){

  return(
    <>
      <div className="flex my-2">
        <div className='border-2 w-[150px] h-[40px] bg-gradient-border rounded-xl flex justify-center items-center mr-2'>
          <button className='w-[98%] h-[95%] border-0 bg-black rounded-xl cursor-pointer'>
            <p className="text-transparent bg-clip-text bg-gradient-text text-center font-semibold text-sm" >
              Select All 
            </p>
          </button>
        </div>
        
        <div className='border-2 w-[120px] h-[40px] bg-gradient-border rounded-xl flex justify-center items-center mr-2'>          
          <button className='w-[98%] h-[95%] border-0 bg-black rounded-xl cursor-pointer'>
            <p className="flex text-transparent bg-clip-text bg-gradient-text text-center font-semibold text-sm" >
              <div className="px-5">
                <Image src={edit} alt="edit" />
              </div>
              Edit
            </p>
          </button>
        </div>

        <div className='border-2 w-[120px] h-[40px] bg-gradient-border rounded-xl flex justify-center items-center mr-2'>          
          <button className='w-[98%] h-[95%] border-0 bg-black rounded-xl cursor-pointer'>
            <p className="flex text-transparent bg-clip-text bg-gradient-text text-center font-semibold text-sm" >
              <div className="px-3">
                <Image src={archive} alt="archive"/>
              </div>
              Archive
            </p>
          </button>
        </div>

        <div className='border-2 w-[120px] h-[40px] bg-gradient-border rounded-xl flex justify-center items-center mr-2'>          
          <button className='w-[98%] h-[95%] border-0 bg-black rounded-xl cursor-pointer'>
            
            <p className="flex text-transparent bg-clip-text bg-gradient-text text-center font-semibold text-sm" >
              <div className="px-3">
                <Image src={exportIcon} alt="export"/>
              </div>
              Export
            </p>
          </button>
        </div>
      </div>
    </>
  )

}
export default SearchButton;