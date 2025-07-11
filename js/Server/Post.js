//-----------Подключаемые модули-----------//
const WorkerController = require('./../Worker/WorkerController');
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
    this.app.post('/excel', (req, res) => {
      req.query.type_request = 'POST /excel';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.post('/pdf', (req, res) => {
      req.query.type_request = 'POST /pdf';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.post('/roles', (req, res) => {
      req.query.type_request = 'POST /roles';
      WorkerController.HandleRequest(req, res);
    });
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
    this.app.post('/accounts', (req, res) => { //user блочит cors
      req.query.type_request = 'POST /user';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.post('/notifications', (req, res) => {
      req.query.type_request = 'POST /notifications';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.post('/divisions', (req, res) => {
      req.query.type_request = 'POST /divisions';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.post('/positions', (req, res) => {
      req.query.type_request = 'POST /positions';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.post('/companies', (req, res) => {
      req.query.type_request = 'POST /companies';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.post('/directions', (req, res) => {
      req.query.type_request = 'POST /directions';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.post('/professions', (req, res) => {
      req.query.type_request = 'POST /professions';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.post('/sections', (req, res) => {
      req.query.type_request = 'POST /sections';
      WorkerController.HandleRequest(req, res);
    });
    /**  */
    this.app.post('/profession_groups', (req, res) => {
      req.query.type_request = 'POST /profession_groups';
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










