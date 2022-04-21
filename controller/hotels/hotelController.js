const Hotels = require("../../models/Hotels");

async function addNewHotel(req,res,next) {
    const hotel = req.body;
    hotel.hotel_id = `gth-${Date.now().toString(36)}${Math.floor(Math.random()*9000)}`
    newHotel = new Hotels(hotel); 
    try {
        const result = await newHotel.save();
        res.status(200).json({result})

    } catch (err) {
        res.status(500).json({
            errors:{
                common:{msg: "Unknown error occured!"}
            }
        })
    }
}


async function getAllHotels(req,res,next) {
    try {
        const hotels = await Hotels.aggregate([
            {
                $project: {
                    hotel_id: 1,
                    hotelName: 1,
                    address: 1,
                    city: 1,
                    country: 1,
                    img_uri: 1,
                    hotel_category: 1
                }
            }
        ]);
        res.status(200).json({hotels,success: true});
    } catch (err) {
        res.status(501).json({message:"Something went wrong",success: false})
    }
}



async function getSingleHotels(req,res,next) {
    const hotelID = req.params.hotel_id;
    try {
        const hotel = await Hotels.findOne({hotel_id:hotelID});
        res.status(200).json({hotel,success: true});
    } catch (err) {
        res.status(501).json({message:"Something went wrong",success: false})
    }
}

async function getOwnersHotels(req,res,next) {
    // const hotelID = req.params.hotel_id;
    if (req.body?.owner_email === req?.decodedUser?.email) {
        try {
            const hotels = await Hotels.find({owner_email:req?.decodedUser?.email});
            res.status(200).json({hotels,success: true});
        } catch (err) {
            res.status(501).json({message:"Something went wrong",success: false})
        }
    }else{
        res.status(501).json({message:"Something went wrong",success: false})
    }
}

async function deleteSingleHotel(req,res,next) {
    const hotelID = req.params.hotel_id;
    if (req?.decodedUser?.email) {
        try {
            const hotel = await Hotels.findOne({hotel_id:hotelID});
            if (hotel.owner_email == req?.decodedUser?.email) {
                const result = await Hotels.deleteOne({hotel_id:hotelID});
                res.status(200).json({result,success: true});
            }else{
                res.status(501).json({message:"You are not authorized",success: false})
            }
        } catch (err) {
            res.status(501).json({message:"Something went wrong",success: false})
        }
    }else{
        res.status(501).json({message:"You are not authorized",success: false})
    }
}

async function updateAHotel(req,res,next) {
    const hotelID = req.params.hotel_id;
    if (req?.decodedUser?.email) {
        try {
            const hotel = await Hotels.findOne({hotel_id:hotelID});
            if (hotel.owner_email == req?.decodedUser?.email) {
                    const result = await Hotels.updateOne(
                        {hotel_id:hotelID},
                        {$set: req.body}
                    );
                    console.log(result,req.body);
                    res.status(200).json({result,success: true});
            }else{
                res.status(501).json({message:"You are not authorized",success: false})
            }
        } catch (err) {
            res.status(501).json({message:"Something went wrong",success: false})
        }
    }else{
        res.status(501).json({message:"You are not authorized",success: false})
    }
}




module.exports ={
    addNewHotel,
    getAllHotels,
    getSingleHotels,
    getOwnersHotels,
    deleteSingleHotel,
    updateAHotel
}