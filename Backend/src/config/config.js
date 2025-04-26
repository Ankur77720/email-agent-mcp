import { config } from "dotenv";
config();


const _config = {
    PORT: process.env.PORT || 3000,
}


export default Object.freeze(_config);