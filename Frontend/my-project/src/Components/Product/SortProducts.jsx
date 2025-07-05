import React from 'react'
import { useSearchParams } from 'react-router-dom'



function SortProducts() {

  const [searchParams,setSearchParams] = useSearchParams();
  const handleSortChange=(e)=>{
    const sortBy= e.target.value;
    searchParams.set("sortBy",sortBy);
    setSearchParams(searchParams);

  }
  return (
    <div className='mb-4 flex items-center justify-end'>
      <select value={searchParams.get("sortBy") || ""} onChange={handleSortChange} id="sort" className='border rounded-lg p-2 focus:outline-none'>
        <option value="">Default</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>

      </select>
       
    </div>
  )
}

export default SortProducts
