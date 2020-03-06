import {VehicleSpawn} from './schema';
// import * as mongoose from 'mongoose';
const mongoose = require("mongoose");

// подключение
mongoose.connect("mongodb://localhost:27017/dayz", { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});
  
const vehicle = new VehicleSpawn({
    hash: 'turismor',
    description: 'descr',
    color: [255, 255, 255, 255, 255, 255],
    position: {
        x: 111,
        y: 111,
        z: 111,
    },
    rotation: {
        x: 111,
        y: 111,
        z: 111,
    },
});

async function VehicleCreate() {
    await vehicle.save()
        .catch(error => console.log(error)) // Если ошибка есть, он её выведет.
        .then(result => console.log(result)) // Выводит результат, если ошибок нет.
}

VehicleCreate(); 