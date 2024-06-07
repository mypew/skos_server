//-----------Подключаемые модули-----------//
const Mysql = require('./../Data/Mysql');
const Divisions = require('./../Data/Divisions');
const Directions = require('./../Data/Directions');
const Professions = require('./../Data/Professions');
const Sections = require('./../Data/Sections');
const Table = require('./../Data/Table');
const Notification = require('./../Data/Notification');
const User = require('./../Data/User');
const ProfessionGroups = require('./../Data/ProfessionGroups');
const Authorization = require('./../Server/Authorization');
//-----------Подключаемые модули-----------//

/**
 * Класс, являющийся обработчиком запросов
 */
class HundlerRequest {

    /**
     * Функция, которая направляет запрос на обработку, а после возвращает результат обработки
     */
    static async Router(message) {
        switch (message.type_request) {
            case "GET /divisions":
                return await HundlerRequest.GetDivisions(message);
            case "GET /directions":
                return await HundlerRequest.GetDirections(message);
            case "GET /professions":
                return await HundlerRequest.GetProfessions(message);
            case "GET /sections":
                return await HundlerRequest.GetSections(message);
            case "GET /profession_groups":
                return await HundlerRequest.GetProfessionGroups(message);
            case "POST /login":
                return await HundlerRequest.PostLogin(message);
            case "POST /token_verify":
                return await HundlerRequest.PostTokenVerify(message);
            case "POST /table":
                return await HundlerRequest.PostTable(message);
            case "POST /user":
                return await HundlerRequest.PostUser(message);
            case "POST /notification":
                return await HundlerRequest.PostNotification(message);
        }
        return { message: "request is not defined" };
    }

    /**
     * 
     */
    static async GetDivisions(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем Divisions запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Divisions.Get(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`Divisions обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async GetDirections(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем Directions запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Directions.Get(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`Directions обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async GetProfessions(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем Professions запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Professions.Get(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`Professions обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async GetSections(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем Sections запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Sections.Get(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`Sections обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async GetProfessionGroups(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем ProfessionGroups запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await ProfessionGroups.Get(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`ProfessionGroups обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async PostLogin(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostLogin запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Authorization.Login(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostLogin обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async PostTokenVerify(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostTokenVerify запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Authorization.TokenVerify(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostTokenVerify обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async PostTable(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostTable запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Table.Post(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostTable обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async PostUser(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostUser запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await User.Post(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostUser обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async PostNotification(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostNotification запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Notification.Post(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostNotification обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }
}
//-----------Экспортируемые модули-----------//
module.exports = HundlerRequest;
//-----------Экспортируемые модули-----------//