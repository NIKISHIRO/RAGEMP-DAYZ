import {VehicleSpawn} from './schema';
// import * as mongoose from 'mongoose';
const mongoose = require("mongoose");

// подключение
mongoose.connect("mongodb://localhost:27017/dayz", { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});