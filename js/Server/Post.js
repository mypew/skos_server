//-----------Подключаемые модули-----------//
const WorkerController = require('./WorkerController');
const bodyParser = require('body-parser');
//-----------Подключаемые модули-----------//

/**
 * Класс для работы с Get запросами к серверу
 */
class Post {
  /** Объект для работы с сервером */
  app;

  /** Конструктор класса */
  constructor(app) {
    this.app = app;
    this.PostBodyParser();
    this.ListPost();
  }

  /**
   * Список всех обрабатываемых сервером Get запросов
   */
  ListPost() {
    /**  */
    this.app.post('/login', (req, res) => {
      req.query.type_request = 'POST /login';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.post('/token_verify', (req, res) => {
      req.query.type_request = 'POST /token_verify';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.post('/table', (req, res) => {
      req.query.type_request = 'POST /table';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.post('/user', (req, res) => {
      req.query.type_request = 'POST /user';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.post('/notification', (req, res) => {
      req.query.type_request = 'POST /notification';
      WorkerController.HandleRequest(req, res);
    });
  }

  /**
   * 
   */
  PostBodyParser() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }
}

//-----------Экспортируемые модули-----------//
module.exports = Post;
//-----------Экспортируемые модули-----------//










