//-----------Подключаемые модули-----------//
const HundlerRequest = require('./../Server/HundlerRequest');
//-----------Подключаемые модули-----------//

/**
 * Класс, который отвечает за дочерние процессы-работники(воркеры), который работают
 * параллельно с родительским процессом.
 */
class Worker {

  /** Конструктор класса */
  constructor() {
    /** Привязывание обработчика сообщений от родительского процесса к функции Handler */
    process.on('message', (message) => {
      this.HandlerMessage(JSON.parse(message));
    });
  }

  /**
   * Функция, которая является обработчиком сообщений в виде объекта от родительского процесса
   */
  async HandlerMessage(message) {
    let data = await HundlerRequest.Router(message);
    this.Send(data);
  }

  /**
   * Функция, которая отправляет сообщение в видео объекта родительскому классу
   */
  Send(message) {
    process.send(JSON.stringify(message));
  }
}

new Worker();

//-----------Экспортируемые модули-----------//
module.exports = Worker;
//-----------Экспортируемые модули-----------//