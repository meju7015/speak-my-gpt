import dotenv from 'dotenv';
import { callOpenAI } from './src/openAI/index.js'

dotenv.config();

let talk = await callOpenAI(process.argv[2]);
console.log(talk.content);

