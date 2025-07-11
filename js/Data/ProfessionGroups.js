//-----------Подключаемые модули-----------//
const Mysql = require('./../DataBase/Mysql');
const Roles = require('./Roles');
const Authorization = require('./../Server/Authorization');
const ValidationData = require('./../Server/ValidationData');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class ProfessionGroups {
  /**
    * 
    */
  static async Get(message) {
    if(!(await ValidationData.ProfessionGroupsGet(message))) return {error: "Bad data"};

    let data = await Mysql.Request(`skos`, `SELECT id,name FROM ProfessionGroups WHERE id_profession=${message.id_profession};`);

    return data;
  }

  /**
    * 
    */
  static async Post(message) {
    if(!(await ValidationData.ProfessionGroupsPost(message))) return {error: "Bad data"};

    let token = await Authorization.TokenInfo(message);
    if(!token.token_verify) return {error: "Bad token"};

    if(!(await Roles.PermissionsProfessionGroups(message, token.token_info.role))) return {error: "Permission denied"};

    let data = "OK";

    if(message.body.type_request == 'profession_groups_change') {
      for(let i = 0; i < message.body.profession_groups.length; i++) {
        await Mysql.ParameterChange(`skos`, `ProfessionGroups`, message.body.profession_groups[i].status, [
            {name: 'id', data: message.body.profession_groups[i].id, type: 'INT'},
            {name: 'id_profession', data: message.body.profession_groups[i].id_profession, type: 'INT'},
            {name: 'name', data: message.body.profession_groups[i].name, type: 'STRING'}
        ]);
      }
    }
    else if (message.body.type_request == 'profession_groups_info') {
      if(typeof message.body.id_profession != "undefined")
          data = await Mysql.Request(`skos`, `SELECT id,name,id_profession FROM ProfessionGroups WHERE id_profession=${message.body.id_profession};`);
      else data = await Mysql.Request(`skos`, "SELECT id,name,id_profession FROM ProfessionGroups;");
    }
    return data;
}
}

//-----------Экспортируемые модули-----------//
module.exports = ProfessionGroups;
//-----------Экспортируемые модули-----------//