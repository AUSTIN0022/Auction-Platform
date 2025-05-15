import { Auction, Category } from "../../model/DBModel.js";

export const getAuctionsCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).select({ name: 1, description: 1 });
        
        if (!categories) {
            console.log("No categories found");
            return res.json({ success: false, message: "Error fetching Auctions categories" });
        }

        return res.json({ success: true, categories });

    } catch (error) {
        console.error(`Error fetching auctions categories: ${error.message}`);
        console.error(error.stack);
        return res.status(500).json({
            error: error.message,
            message: "Internal Server error"
        });
    }
}
export const createAuction = async (req, res) => {
    let { title, description, basePrice, startDate, endDate, registrationDeadline, emdAmount, status, categorie, createdBy,} = req.body;
    console.log("Request in backend controller");
    try{
        const images = req.files ? req.files.map(file => file.path): [];

        const requiredFields = { title, description, basePrice, startDate, endDate, registrationDeadline, emdAmount, status, categorie, createdBy };

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if(missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.json(', ')}`
            })
        }
        console.log(images);
        if(!images || images.length < 2){
            return res.status(400).json({
                success: false,
                message: " Please upload at least 2 images"
            });
        }
        
        basePrice = parseInt(basePrice);
        if(typeof basePrice !== 'number' || basePrice <= 0) {
            return res.status(400).json({
                success: false,
                message: "Base price must be a positive number"
            });
        }

        emdAmount = parseInt(emdAmount);
        if(typeof emdAmount !== 'number' ||  emdAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "EMD amount must be a positive number"
            });
        }

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);
        const parsedRegistrationDeadline = new Date(registrationDeadline);
        const now = new Date();

        if(isNaN(parsedStartDate) || isNaN(parsedEndDate) || isNaN(parsedRegistrationDeadline)){
            return res.status(400).json({
                success: false,
                message: "Invalid date format"
            })
        }

        if(parsedRegistrationDeadline >= parsedStartDate) {
            return res.status(400).json({
                success: false,
                message: "Registration deadline must be before start date"
            });
        }

        if(parsedStartDate >= parsedEndDate) {
            return res.status(400).json({
                success: false,
                message: "Start date must be before end date"
            });
        }

        if(parsedStartDate <= now) {
            return res.status(400).json({
                success: false,
                message: "Start date must be in the future"
            });
        }

        const validStatus = ['draft', 'pending'];
        if(!validStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatus.join(', ')}`
            });
        }
    
        const newAuction = new Auction({
            title: title.trim(),
            description: description.trim(),
            images, 
            basePrice: Number(basePrice),
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            registrationDeadline: parsedRegistrationDeadline,
            emdAmount: Number(emdAmount),
            status,
            categorie, 
            createdBy
        })
    
        await newAuction.save();

        return res.json({
            success: true,
            message: "Auction created successfully",
            data: {
                auctionId: newAuction._id,
                title: newAuction.title
            }
        })
        
    
    } catch(error) {    
        console.error("Error creating auction:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid data format",
                field: error.path
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
export const getAllAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find({ isDeleted: false }).sort({createdAt: -1});
        if(!auctions){
            return res.status(400).json({
                success: false,
                message: "error getting auctions from the database"
            });
        }

        return res.json({
            success: true,
            message: "All Auctions details",
            auctions
        })
    } catch(error) {
        console.log(`Error fetching all Auctions`)
        return res.status(500).json({
            error: error.message,
            message: 'Internal Server Error'
        });
    }
}

export const getAuctionById = async (req, res) => {
    const auctionId =  req.params.id;
    if(!auctionId){
        return res.status(400).json({
            success: false,
            message: "please provide the Auction Id"
        });
    }
    try {
        const auctionDetails = await Auction.findById({_id: auctionId});

        if(!auctionDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find Auction`
            });
        }

        return res.json({
            success: true,
            message: 'Auctions found',
            auctionDetails
        })
    } catch(error) {
        console.log(`Error fetching the Auction details of ${auctionId}: ${error.message}`);
        return res.status(500).json({
            error: error.message,
            message: "Internal server Error"
        })
    }
    
}

export const updateAuctions = async (req, res) => {
    let {auctionId, title, description, basePrice, startDate, endDate, registrationDeadline, emdAmount, status, categorie, createdBy,} = req.body;
    console.log("Request in backend controller");
    try{
        const images = req.files ? req.files.map(file => file.path): [];

        const requiredFields = { title, description, basePrice, startDate, endDate, registrationDeadline, emdAmount, status, categorie, createdBy };

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if(missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            })
        }
        console.log(images);
        if(!images || images.length < 2){
            return res.status(400).json({
                success: false,
                message: " Please upload at least 2 images"
            });
        }
        
        basePrice = parseInt(basePrice);
        if(typeof basePrice !== 'number' || basePrice <= 0) {
            return res.status(400).json({
                success: false,
                message: "Base price must be a positive number"
            });
        }

        emdAmount = parseInt(emdAmount);
        if(typeof emdAmount !== 'number' ||  emdAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "EMD amount must be a positive number"
            });
        }

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);
        const parsedRegistrationDeadline = new Date(registrationDeadline);
        const now = new Date();

        if(isNaN(parsedStartDate) || isNaN(parsedEndDate) || isNaN(parsedRegistrationDeadline)){
            return res.status(400).json({
                success: false,
                message: "Invalid date format"
            })
        }

        if(parsedRegistrationDeadline >= parsedStartDate) {
            return res.status(400).json({
                success: false,
                message: "Registration deadline must be before start date"
            });
        }

        if(parsedStartDate >= parsedEndDate) {
            return res.status(400).json({
                success: false,
                message: "Start date must be before end date"
            });
        }

        if(parsedStartDate <= now) {
            return res.status(400).json({
                success: false,
                message: "Start date must be in the future"
            });
        }

        const validStatus = ['draft', 'pending'];
        if(!validStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatus.join(', ')}`
            });
        }
    
        const newAuction = {
            title: title.trim(),
            description: description.trim(),
            images, 
            basePrice: Number(basePrice),
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            registrationDeadline: parsedRegistrationDeadline,
            emdAmount: Number(emdAmount),
            status,
            categorie, 
            createdBy
        };
    
        const result = await Auction.findByIdAndUpdate(auctionId, newAuction, { new: true });


        return res.json({
            success: true,
            message: "Auction updated successfully",
            data: {
                auctionId: result._id,
                title: result.title
            }
        });
        
    
    } catch(error) {    
        console.error("Error creating auction:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid data format",
                field: error.path
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
export const deleteAuctions = async (req, res) => {
    const  auctionId  = req.params.id;

    try{    
        if(!auctionId){
            return res.status(400).json({
                success: false,
                message: "Please Provide the Auction ID"
            });
        }

        const result = await Auction.findByIdAndUpdate( 
            auctionId, 
            { isDeleted: true, deletedAt: new Date() }, 
            { new: true}
        );

        if(!result){
            return res.status(400).json({
                success: false,
                message: "Error deleting Auction"
            });
        }

        return res.json({
            success: true,
            message: "Auction deleted",
            result
        });

    } catch(error) {
        console.log("Error deleting auction");
        return res.status(400).json({
            error: error.message,
            message: "Internal Server Error"
        });
    }
}

