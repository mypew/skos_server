//-----------Подключаемые модули-----------//
const Mysql = require('./Mysql');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class Directions {
    /**
     * 
     */
    static async Get(message) {
        let data = await Mysql.Request(`skos`, "SELECT id,name FROM Directions;");
        return data;
    }
}

//-----------Экспортируемые модули-----------//
module.exports = Directions;
//-----------Экспортируемые модули-----------//