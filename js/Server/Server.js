//-----------Подключаемые модули-----------//
const express = require('express');
const fs = require('fs');
const https = require('https');
const Get = require('./Get');
const Post = require('./Post');
const WorkerController = require('./WorkerController');
const Notification = require('./../Data/Notification');
//-----------Подключаемые модули-----------//

/**
 * Класс, являющийся ядром сервера
 */
class Server {
  /** Объект для работы с сервером */
  app = express();
  /** Порт, на котором открыто ядро */
  port;
  /** Фиксированное количество дочерних процессов-работников, должно быть не меньше 1 */
  workers_count;
  /** Фиксированное количество оперативной памяти в МБ, выделяемое на один дочерний процесс-работник */
  workers_memory_size;
  
  /** Конструктор класса */
  constructor(port, workers_count, workers_memory_size) {
    this.port = port;
    this.workers_count = workers_count;
    this.workers_memory_size = workers_memory_size;
    this.Run();
  }

  /**
   * Функция, которая запускает сервер
   */
  Run() {
    let start = new Date().getTime();
    console.log(`Начинаем запуск сервера...`);
    
    //-------------------------------------------------------//
    this.StartListen();
    this.EvasionCORS();
    this.CreateGetRequest();
    this.CreatePostRequest();
    this.CreateWorkers();
    this.Timers();
    //-------------------------------------------------------//

    let finish = new Date().getTime();
    console.log(`Сервер запущен. Время запуска {${(finish-start)/1000}} секунды.`);
  }

  /**
   * Функция, которая запускает прослушивание сервера на указаном порту
   */
  StartListen() {
    const options = {
      cert: fs.readFileSync(__dirname + '/../../.ssl/cert.pem'),
      key: fs.readFileSync(__dirname + '/../../.ssl/privkey.pem')
    };
    https.createServer(options, this.app).listen(this.port);
    //-------------------------------------------------------//

    console.log(`Сервер прослушивается на порту {${this.port}}.`);
  }
  
  /**
   * Функция, которая запускает обработчик всех Get запросов к серверу
   */
  CreateGetRequest() {
    new Get(this.app);
    //-------------------------------------------------------//

    console.log(`Обработчики Get запросов запущены.`);
  }

  /**
   * Функция, которая запускает обработчик всех Get запросов к серверу
   */
  CreatePostRequest() {
    new Post(this.app);
    //-------------------------------------------------------//

    console.log(`Обработчики Post запросов запущены.`);
  }

  /**
   * Функция, которая создаёт дочерние процессы-работники
   */
  CreateWorkers() {
    WorkerController.CreateWorkers(this.workers_count, this.workers_memory_size);
    //-------------------------------------------------------//

    console.log(`Создано {${this.workers_count}} дочерних процессов-работников.`);
    console.log(`На каждый дочерний процесс-работник выделено {${this.workers_memory_size}} MB памяти.`);
  }

  /**
   * Функция, которая добавляет дополнительные параметры к возвращаемым запросам, чтобы обходить защиту CORS
   */
  EvasionCORS() {
    /** Функция, которая срабатывает при любых запросах, нужна для обхода защиты CORS */
    this.app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "*");
      res.header("Access-Control-Allow-Headers", "*");// X-Requested-With
      next();
    });
  }

  /**
   * Функция, которая запускает таймеры, циклически срабатывающих
   */
  Timers() {
    Notification.RecostingNotifications();
    //-------------------------------------------------------//

    console.log(`Запущены все таймеры.`);
  }
}

//-----------Экспортируемые модули-----------//
module.exports = Server;
//-----------Экспортируемые модули-----------//