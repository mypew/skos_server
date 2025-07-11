//-----------Подключаемые модули-----------//
const WorkerController = require('./../Worker/WorkerController');
//-----------Подключаемые модули-----------//

/**
 * Класс для работы с Get запросами к серверу
 */
class Get {
  /** Объект для работы с сервером */
  app;

  /** Конструктор класса */
  constructor(app) {
    this.app = app;
    this.ListGet();
  }

  /**
   * Список всех обрабатываемых сервером Get запросов
   */
  ListGet() {
    /**  */
    this.app.get('/divisions', (req, res) => {
      req.query.type_request = 'GET /divisions';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.get('/directions', (req, res) => {
      req.query.type_request = 'GET /directions';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.get('/professions', (req, res) => {
      req.query.type_request = 'GET /professions';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.get('/sections', (req, res) => {
      req.query.type_request = 'GET /sections';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.get('/profession_groups', (req, res) => {
      req.query.type_request = 'GET /profession_groups';
      WorkerController.HandleRequest(req, res);
    });
  }
}

//-----------Экспортируемые модули-----------//
module.exports = Get;
//-----------Экспортируемые модули-----------//










