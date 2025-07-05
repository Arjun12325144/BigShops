const express = require("express");
const Product = require("../models/Product")
const {protect,admin} = require("../middleware/authMiddleware")

const router = express.Router();
//route POST /api/products
//desc Create a new Product
// access Private /admin can create products
router.post("/", protect,admin, async (req,res)=>{
    try{
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;
        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user:req.user._id, //reference to admin user who created it 
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    }
    catch(err){
        console.error(err);
        res.status(500).send("server error");
    }
})


//@route PUT /api/products/:id
//@desc update an existing product ID
// @access Private/admin
router.put("/:id",protect,admin,async (req,res)=>{
    console.log("Updating Product:", req.params.id);
  console.log("Received body:", JSON.stringify(req.body, null, 2));

    try{
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;
        //find product by ID
        const product = await Product.findById(req.params.id);
        if(product){
            //update product fileds
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured =
              isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished =
              isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku; 

            //save the updated product
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        }
        else{
            res.status(404).json({message:"Product not found"});
        }
    }
    catch(err){
        console.error(err);
        res.status(500).send("server Error");
    }
})


//@routes DELETE /api/products/:id
//Delete a product by id
// access private/admin

router.delete("/:id",protect,admin,async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(product){
            //remove from database
            await product.deleteOne();
            res.json({message:"product removed"});
        }
        else{
            res.status(404).json({message:'product not found'})
        }
    }
    catch(err){
        console.error(err);
        res.status(500).send("server Error");
    }
})


//@route GET /api/products
//get all products with optional query filters
//access public

router.get("/",async (req,res)=>{
    try{
        const {
            collection,
            size,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit,
        } = req.query;

        let query = {};
        //filter logic
        if(collection && collection.toLocaleLowerCase() !== "all"){
            query.collection = collection;
        }
        if(category && category.toLocaleLowerCase() !== "all"){
            query.category = category
        }
        if(material){
            query.material = { $in: material.split(",") }
        }
        if(brand){
            const brands = brand.split(",").map(b => b.trim());
            query.brand = { $in: brands.map(b => new RegExp(`^${b}$`, "i")) };
            // query.brand = { $in: brand.split(",") }
        }
        if(size){
            query.sizes = { $in: size.split(",") }
        }
        if(color){
            query.colors = {$in: [color]}
        }
        if(gender){
             let normalizedGender = gender;
            if (gender.toLowerCase() === "male") normalizedGender = "Men";
            else if (gender.toLowerCase() === "female") normalizedGender = "Women";
            else normalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
            query.gender = normalizedGender;
            // query.gender = gender;
            //  query.gender = { $regex: `^${gender}$`, $options: "i" };

        }
        if(minPrice || maxPrice){
            query.price = {};
            if(minPrice) query.price.$gte = Number(minPrice);
            if(maxPrice) query.price.$lte = Number(maxPrice)
        }
        if(search){
            query.$or = [
                {name: {$regex: search, $options:"i"}},
                {description: {$regex: search, $options:"i"}},
                {category: {$regex: search, $options:"i"}},
            ]
        }

        //sort logic
        let sort = {};
        if(sortBy){
            switch (sortBy){
                case "priceAsc":
                    sort = {price:1};
                    break;
                case "priceDesc":
                    sort = {price:-1};
                    break;
                case "popularity":
                    sort = {rating:-1};
                    break;
                default:
                    break;
            }
        }
        //fetch products and apply sorting and limit
        let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
        res.json(products)
    }
    catch(err){
        console.error(err);
        res.status(500).send("server error");
    }
})



//@route grt /api/products/best-seller
// @desc retrieve the product with highest rating
// @access public

router.get("/best-seller",async (req,res)=>{
    try{
        const bestSeller = await Product.findOne().sort({rating:-1});
        if(bestSeller){
            res.json(bestSeller);
        }
        else{
            res.status(404).json({message:"No best seller found"});
        }

    }
    catch(err){
        console.error(err);
        res.status(500).send("server error");
    }
})


//route get /api/product/new-arrivals
// retrieve 8 latest product - creation date
// access public
router.get("/new-arrivals", async (req,res)=>{
    try{
        const newArrivals = await Product.find().sort({createdAt:-1}).limit(8);
        res.json(newArrivals);
    }
    catch(err){
        console.error(err);
        res.status(500).send("server Error");
    }
})





// @route get /api/products/:id
// get a single product by id
// access public

router.get("/:id",async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(product){
            res.json(product);
        }
        else{
            res.status(404).json({message:"Product not found"})
        }
    }
    catch(err){
        console.error(err);
        res.status(500).send("server error");
    }
})


// @route get /api/products/similar:id
// get retrieve similar products based on the current products's gender and category
// access public
router.get("/similar/:id", async (req,res)=>{

    const {id} = req.params;
    // console.log(id)
    try{
        const product = await Product.findById(id);
        if(!product) {
            return res.status(404).json({message:"product not found"});
        }
        const similarProducts = await Product.find({
            _id: {$ne: id},
            gender: product.gender,
            category: product.category,
        }).limit(4);
        res.json(similarProducts)

    }
    catch(err){
        console.error(err);
        res.status(500).send("server error");
    }
})


 




module.exports = router;