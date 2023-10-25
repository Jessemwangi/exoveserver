import mysql from 'mysql';
import { MSQLDbConfigs } from './dbConfig.js';
export const db = mysql.createConnection(MSQLDbConfigs);