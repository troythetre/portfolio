import { useState, useEffect } from "react"
import { BASEURL } from "../../../constants";

export default function Demo() {
    const [data, setData] = useState();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASEURL}/api/proposal/question-deadlines/RFP100/Question1`,
                    {
                       credentials: "include",
                    });
                const data = (await response.json());
                console.log("Fetch data", data)
                setData(data)
            }
            catch (error) {
                console.error("Fetch error", error)
            }
        }

        fetchData();
    }, []);

    return (
      <div>
        <p>data : {JSON.stringify(data)}</p>
      </div>
    )
}

