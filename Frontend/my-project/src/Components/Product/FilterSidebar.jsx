import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function FilterSidebar() {
  // In React, useSearchParams is a hook from React Router that allows you to read and update the query parameters in the URL.
  const [searchParams,setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters,setFilters] = useState({
    category : "",
    gender:"",
    color:"",
    size:[],
    material:[],
    brand:[],
    minPrice:0,
    maxPrice:100
  })
  const [priceRange,setPriceRange] = useState([0,100]);
  const categories = ["Top Wear","Bottom Wear"];
  const colors=[
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Grey",
    "White",
    "Pink",
    "Beige",
    "Navy",
  ];
  const sizes = ["XS","S","M","L","XL","XXL"];
  const materials = [
    "Cotton",
    "Wool",
    "Denium",
    "Polyester",
    "Silk",
    "Linen",
    "Viscose",
    "Fleece",
  ]
  const brands = [
    "Urban Threads",
    "Modern Fit",
    "Street Style",
    "Beach Breeze",
    "Fashionista",
    "ChicStyle",

  ];
  const genders = ["Male","Female"];
  useEffect(()=>{
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      category: params.category || "",
      gender : params.gender || "",
      color : params.color || "",
      size: params.size ? params.size.split(","):[],
      material: params.material ? params.material.split(","):[],
      brand: params.brand ? params.brand.split(","):[],
      minPrice : params.minPrice || 0,
      maxPrice : params.maxPrice || 100
    });
    setPriceRange([0, params.maxPrice || 100]);
  },[searchParams]);

  const handlefilterChange = (e)=>{
    const {name,value,checked,type} = e.target;
    // console.log({name,value,checked,type})
    let newFilter = { ...filters };
    if(type === "checkbox"){
      if(checked){
        newFilter[name] = [...(newFilter[name] || []),value];

      }
      else{

        newFilter[name] = newFilter[name].filter((item)=>item!==value);
      }
    }
    else{
      newFilter[name] = value;
    }
    setFilters(newFilter);
    updateURLParams(newFilter);
    console.log(newFilter);

  }
// ya to ha link badalna ka liya
  const updateURLParams = (newFilters)=>{
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key)=>{
      if(Array.isArray(newFilters[key]) && newFilters[key].length > 0){
        params.append(key,newFilters[key].join(","));
      }
      else if(newFilters[key]){
        params.append(key,newFilters[key]);
      }
    })
    setSearchParams(params);
    navigate(`?${params.toString()}`);

  }
  const handlePriceChange = (e)=>{
    const newPrice = e.target.value;
    setPriceRange([0,newPrice]);
    const newFilters = {... filters,minPrice:0, maxPrice:newPrice};
    setFilters(filters);
    updateURLParams(newFilters);
  }
  return (
    <div className='p-4'>
      <h3 className='text-lg font-medium text-gray-800 mb-4'>Filter</h3>
      {/* category */}
      <div className='mb-4'>
        <label className='block font-medium text-gray-600 mb-2'>Category</label>
        {categories.map((category)=>(
          <div key={category} className='flex items-center  mb-1'>
              <input value={category} checked={filters.category === category} onChange={handlefilterChange} className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' type="radio" name="category" id="" />
              <span className='text-gray-700 text-sm'>{category}</span>

          </div>
        ))}
      </div>

      <div className='mb-4'>
        <label className='block font-medium text-gray-600 mb-2'>Gender</label>
        {genders.map((gender)=>(
          <div className='flex items-center mb-1' key={gender}>
            <input checked={filters.gender === gender} value={gender}  onChange={handlefilterChange}  type="radio" name="gender" id=""  className='mr-2 w-4 h-4 text-blue-500 focus:ring-blue-400 border-gray-300'/>
            <span className='text-sm text-gray-700'>{gender}</span>

          </div>
        ))}
      </div>
        <div className='mb-4'>
          <label className='block text-gray-600 font-medium mb-2'>Color</label>
          <div className='flex flex-wrap gap-2'>
            {colors.map((color)=>(
              <button value={color}   onClick={handlefilterChange} key={color} name='color' 
              className={`w-8 h-8 rounded-full border-gray-300 cursor-pointer  transition hover:scale-105 ${filters.color===color ? "ring-2 ring-blue-700":""}`}
              style={{backgroundColor:color.toLowerCase()}}> </button>
            ))}

          </div>
        </div>
        {/* sizes */}
        <div className='mb-6'>
          <label className='block text-gray-600 font-mediummb-2'>Size</label>

          {sizes.map((size)=>(
            <div key={size} className='flex items-center mb-1'>
              <input checked={filters.size.includes(size)} value={size}  onChange={handlefilterChange} type="checkbox" name="size" className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' id="" />
              <span className='text-sm text-gray-700'>{size}</span>
            </div>
          ))}
        </div>
        {/* material */}
        <div className='mb-6'>
          <label className='block text-gray-600 font-medium mb-2'>Material</label>

          {materials.map((material)=>(
            <div key={material} className='flex items-center mb-1'>
              <input checked={filters.material.includes(material)} value={material}  onChange={handlefilterChange} type="checkbox" name="material" className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' id="" />
              <span className='text-sm text-gray-700'>{material}</span>
            </div>
          ))}
        </div>

        {/* brand */}
        <div className='mb-6'>
          <label className='block text-gray-600 font-mediummb-2'>Brand</label>

          {brands.map((brand)=>(
            <div key={brand} className='flex items-center mb-1'>
              <input checked={filters.brand.includes(brand)} value={brand}  onChange={handlefilterChange} type="checkbox" name="brand" className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' id="" />
              <span className='text-sm text-gray-700'>{brand}</span>
            </div>
          ))}
        </div>

        {/* range */}
        <div className='mb-6'>
          <label className='block font-medium text-gray-700 mb-2'>Range</label>
          <input value={priceRange[1]} onChange={handlePriceChange} type="range" name="priceRange" min={0} max={100} className='appearance-none cursor-pointer w-full h-2 bg-gray-200 rounded-lg' id="" />
          <div className='flex justify-between mt-2 text-gray-600'>
            <span>$0</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
    </div>
  )
}

export default FilterSidebar
