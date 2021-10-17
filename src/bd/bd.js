import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

export default function connectDB() {
  const uri = process.env.ATLAS_URI;
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log(
      " La conexión con la base de datos MongoDB se estableció satisfactoriamente"
    );
  });
}
