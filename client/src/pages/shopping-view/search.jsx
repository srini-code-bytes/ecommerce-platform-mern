import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";



function SearchProducts() {

    // const [keyword, setKeyword] = useState('')
    // const [searchParams, setSearchParams] = useSearchParams()
    // const {searchResults} = 

    // useEffect(() => {
    //     console.log("keyword===>", keyword)
    //     if (keyword && keyword.trim() !== '' && keyword.length > 3) {
    //         // call api to search products
    //         setTimeout(() => {
    //             setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
    //         })

    //     }

    // }, [keyword])

//     <div className="flex justify-center mb-8">
//     <div className="w-full flex items-center">
//         <Input value={keyword} name={keyword}
//             onChange={(event) => setKeyword(event.target.value)}
//             className="py-6" placeholder="Search for Products..." >
//         </Input>
//     </div>
// </div>

    return (
        <div className="container mx-auto md:px-6 px-4 py-8">
            <div>
                Search Results
            </div>
        </div>
    )
}

export default SearchProducts;