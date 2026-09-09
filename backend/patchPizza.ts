import { config } from "dotenv";
config();
import mongoose from "mongoose";
import Food from "./src/models/Food";

mongoose.connect(process.env.MONGODB_URI as string).then(async () => {
  try {
    const res = await Food.updateMany(
      { name: /peperoni/i },
      { $set: { sizePrices: { "10": 1500, "14": 2000, "16": 2500 } } }
    );
    console.log("Updated pizzas:", res.modifiedCount);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
});
