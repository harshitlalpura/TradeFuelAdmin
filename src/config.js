import dotenv from 'dotenv';
dotenv.config();


export const config = {
    SECRET_KEY: process.env.REACT_APP_SECRET_KEY,
    BASE_URL: process.env.REACT_APP_BASE_URL
    // add more variables as needed
};
