//-----------Подключаемые модули-----------//
const Mysql = require('./../DataBase/Mysql');
const Roles = require('./../Data/Roles');
const Companies = require('./../Data/Companies');
const Divisions = require('./../Data/Divisions');
const Positions = require('./../Data/Positions');
const Directions = require('./../Data/Directions');
const Professions = require('./../Data/Professions');
const Sections = require('./../Data/Sections');
const Table = require('./../Data/Table');
const Notifications = require('./../Data/Notifications');
const User = require('./../Data/User');
const ProfessionGroups = require('./../Data/ProfessionGroups');
const Authorization = require('./Authorization');
const Pdf = require('./../Document/Pdf');
const Excel = require('./../Document/Excel');
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
            case "POST /roles":
                return await HundlerRequest.PostRoles(message);
            case "POST /excel":
                return await HundlerRequest.PostExcel(message);
            case "POST /pdf":
                return await HundlerRequest.PostPdf(message);
            case "POST /login":
                return await HundlerRequest.PostLogin(message);
            case "POST /token_verify":
                return await HundlerRequest.PostTokenVerify(message);
            case "POST /table":
                return await HundlerRequest.PostTable(message);
            case "POST /user":
                return await HundlerRequest.PostUser(message);
            case "POST /notifications":
                return await HundlerRequest.PostNotifications(message);
            case "POST /divisions":
                return await HundlerRequest.PostDivisions(message);
            case "POST /positions":
                return await HundlerRequest.PostPositions(message); 
            case "POST /directions":
                return await HundlerRequest.PostDirections(message);
            case "POST /companies":
                return await HundlerRequest.PostCompanies(message);    
            case "POST /professions":
                return await HundlerRequest.PostProfessions(message);
            case "POST /sections":
                return await HundlerRequest.PostSections(message);
            case "POST /profession_groups":
                return await HundlerRequest.PostProfessionGroups(message);
        }
        return { message: "request is not defined" };
    }

    /**
     * 
     */
    static async GetDivisions(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем GetDivisions запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Divisions.Get(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`GetDivisions обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async GetDirections(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем GetDirections запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Directions.Get(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`GetDirections обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async GetProfessions(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем GetProfessions запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Professions.Get(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`GetProfessions обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async GetSections(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем GetSections запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Sections.Get(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`GetSections обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async GetProfessionGroups(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем GetProfessionGroups запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await ProfessionGroups.Get(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`GetProfessionGroups обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async PostCompanies(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostCompanies запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Companies.Post(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostCompanies обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async PostExcel(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostExcel запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Excel.Post(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostExcel обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async PostPdf(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostPdf запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Pdf.Post(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostPdf обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async PostRoles(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostRoles запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Roles.Post(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostRoles обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async PostDivisions(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostDivisions запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Divisions.Post(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostDivisions обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async PostPositions(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostPositions запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Positions.Post(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostPositions обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async PostDirections(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostDirections запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Directions.Post(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostDirections обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async PostProfessions(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostProfessions запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Professions.Post(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostProfessions обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async PostSections(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostSections запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Sections.Post(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostSections обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }

    /**
     * 
     */
    static async PostProfessionGroups(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostProfessionGroups запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await ProfessionGroups.Post(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostProfessionGroups обработан за {${(finish - start) / 1000}} сек.`);

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
    static async PostNotifications(message) {
        let start = new Date().getTime();
        console.log(`Обрабатываем PostNotifications запрос...`);
        console.log(message);

        //-------------------------------------------------------//
        let data = await Notifications.Post(message);
        //-------------------------------------------------------//

        let finish = new Date().getTime();
        console.log(`PostNotifications обработан за {${(finish - start) / 1000}} сек.`);

        return data;
    }
}
//-----------Экспортируемые модули-----------//
module.exports = HundlerRequest;
//-----------Экспортируемые модули-----------//