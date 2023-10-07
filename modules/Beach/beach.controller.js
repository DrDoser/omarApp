import BeachModel from "../../DB/models/beachmodel.js";
import cloudinary from "../../utils/cloudinary.js";

export const addBeach = async (req, res, next) => {
  try {
    const {
      beachName,
      capabilityToSwim,
      capabilityToDrink,
      species,
      city,
      tips,
    } = req.body;
    const { files } = req; // Assuming 'express-fileupload' middleware is used

    if (await BeachModel.findOne({ beachName, city })) {
      return res
        .status(400)
        .json({ message: "A beach with the same name already exists" });
    }

    // Create an array to store the Cloudinary URLs for uploaded images
    const imageUrls = [];

    // Loop through each species and upload its image to a separate folder
    for (const [index, speciesName] of species.entries()) {
      if (files[index]) {
        const file = files[index];
        const { secure_url } = await cloudinary.uploader.upload(file.path, {
          folder: `${process.env.PROJECT_FOLDER}/Beachs/${beachName}/Species/${speciesName}','${city}.`,
          use_filename: true, // Use the original filename
        });
        imageUrls.push(secure_url);
      } else {
        imageUrls.push(null);
      }
    }

    console.log("imageUrls", imageUrls);

    // Create a new beach document with the image URLs
    const newBeach = await BeachModel.create({
      beachName,
      capabilityToSwim,
      capabilityToDrink,
      species,
      city,
      tips,
      photos: imageUrls, // Store species-specific image URLs
    });

    if (!newBeach) {
      // Delete the uploaded photos if beach creation fails
      for (const imageUrl of imageUrls
        .flat()
        .map((item) => item.photo)
        .filter(Boolean)) {
        await cloudinary.uploader.destroy(imageUrl);
      }
      return res
        .status(400)
        .json({ message: "Failed to add the beach. Please try again later" });
    }

    return res.status(200).json({ message: "Beach added successfully" });
  } catch (error) {
    // Handle errors here
    console.error(error);
    next(error);
  }
};

export const searchBeach = async (req, res, next) => {
  const { beachName } = req.body;
  const pattern = new RegExp(`${beachName}`, "i");

  try {
    const beaches = await BeachModel.find({
      $or: [{ beachName: { $regex: pattern } }, { city: { $regex: pattern } }],
    });

    // refact beaches in cityWaterCirculation
    // refact tips in tipsNewLine
    beaches.forEach((beach) => {
      beach.city = cityWaterCirculation(beach.city);
      console.log(beach.city);
      beach.tips = tipsNewLine(beach.tips);
    });

    res.json(beaches);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
    next(error);
  }
};

// add a new line before numbers using regex
// const text = "1. one 2. two 3. three";

const tipsNewLine = (tips) => {
  // (\d+)(?=\s*-)

  const regex = /(\d+)(?=\s*-)/g;
  const newTips = tips.replace(regex, "\n$&");
  // console.log(newTips);
  return newTips;
};

// 	•	Matrouh
// •	Alexandria
// •	Port Said

const mediterraneanSea = ["Matrouh", "Alexandria", "Port Said"];
// •	Hurghada
// •	Sharm el-Sheikh
// •	Marsa Alam
// •	Halayeb
// •	Al-qusayr
// •	Safaga
// •	Ras gharib
// •	 Al-Arish
// •	Ain sokhna

const redSea = [
  "Hurghada",
  "Sharm el-Sheikh",
  "Marsa Alam",
  "Halayeb",
  "Al-qusayr",
  "Safaga",
  "Ras gharib",
  "Al-Arish",
  "Ain sokhna",
];

// find city and chose if Water circulation of Mediterranean sea
//  or Water circulation of Red sea

const cityWaterCirculation = (city) => {
  if (mediterraneanSea.includes(city)) {
    return `${city} : Water circulation of Mediterranean sea 	
The water in the Mediterranean Sea flows from west to east, driven by the water flowing in from the Atlantic Ocean. As the water flows east, it changes because of the sun and the air. The Mediterranean Sea's water circulation is important for the region's climate and ecology.`;
  } else if (redSea.includes(city)) {
    return `${city} : Water circulation of red sea
The water in the Red Sea flows from south to north, then back south again, but along the bottom of the sea. This is because the water gets warmer and saltier as it flows north, so it becomes denser and sinks.`;
  } else {
    return city;
  }
};
