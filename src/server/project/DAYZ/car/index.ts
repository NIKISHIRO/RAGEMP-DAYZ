import './Car';

export interface VehicleCoord {
    position: Vector3Mp;
    description?: string; // Описание, которое можно вывести потом через ф-ю.
    hash: RageEnums.Hashes.Vehicle; // RageEnums - в типах можно найти ЕНУМЫ для указания этого хэша.
}

// Спавнит кар по хэшу.
// spawnCar(hash: RageEnums.Hashes.Vehicle, position: Vector3Mp, description?: string): void;

// Сохраняет машину в JSON-файл(vehicleCoords.json). Добавив его в массив того файла.
// saveCar(hash: RageEnums.Hashes.Vehicle, position: Vector3Mp, description?: string): void;

// Возвращает массив машин из JSON-файла.  
// loadCars(): cars: VehicleCoord[];

/* Можешь использовать приватные функции, логически вынося функционал в отдельные из них. Главное
чтобы на выходе были эти функции. */