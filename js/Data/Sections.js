//-----------Подключаемые модули-----------//
const Mysql = require('./Mysql');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class Sections {
    /**
     * 
     */
    static async Get(message) {
        let data = await Mysql.Request(`skos`, "SELECT id,name FROM Sections;");
        return data;
    }
}

//-----------Экспортируемые модули-----------//
module.exports = Sections;
//-----------Экспортируемые модули-----------//