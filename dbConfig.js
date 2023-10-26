// require("dotenv").config();
import dotenv from 'dotenv';
dotenv.config();
export const MSQLDbConfigs ={
host:process.env.MSQHOST,
port:process.env.MSQPORT,
user:process.env.MSQUSER,
password:process.env.MSQPASSWORD,
database:process.env.MSQDATABASE,
allowPublicKeyRetrieval: true

}
