//-----------Подключаемые модули-----------//
const Server = require('./Server/Server');
//-----------Подключаемые модули-----------//

/** Порт, на котором будет открыт сервер */
const PORT = 7070;
/** Количество дочерних процессов-работников */
const WORKERS_COUNT = 10;
/** Количество оперативной памяти в МБ, выделяемое на один дочерний процесс-работник */
const WORKERS_MEMORY_SIZE = 128;

/** Создание и запуск сервера */
new Server(PORT, WORKERS_COUNT, WORKERS_MEMORY_SIZE);