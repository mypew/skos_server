//-----------Подключаемые модули-----------//
const Mysql = require('./Mysql');
const ValidationData = require('./../SubModules/ValidationData');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class ProfessionGroups {
  /**
    * 
    */
  static async Get(message) {
    if(!(await ValidationData.ProfessionGroups(message))) return {error: "Bad data"};

    let data = await Mysql.Request(`skos`, `SELECT id,name FROM ProfessionGroups WHERE id_profession=${message.id_profession};`);

    return data;
  }
}

//-----------Экспортируемые модули-----------//
module.exports = ProfessionGroups;
//-----------Экспортируемые модули-----------//