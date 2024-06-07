//-----------Подключаемые модули-----------//
const Mysql = require('./Mysql');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class Divisions {
    /**
     * 
     */
    static async Get(message) {
        let data = await Mysql.Request(`skos`, "SELECT id,name FROM Divisions;");
        return data;
    }
}

//-----------Экспортируемые модули-----------//
module.exports = Divisions;
//-----------Экспортируемые модули-----------//