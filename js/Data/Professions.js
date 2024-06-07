//-----------Подключаемые модули-----------//
const Mysql = require('./Mysql');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class Professions {
    /**
    * 
    */
    static async Get(message) {
        let data = await Mysql.Request(`skos`, "SELECT id,name FROM Professions;");
        return data;
    }
}

//-----------Экспортируемые модули-----------//
module.exports = Professions;
//-----------Экспортируемые модули-----------//