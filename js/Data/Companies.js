//-----------Подключаемые модули-----------//
const Mysql = require('./../DataBase/Mysql');
const Roles = require('./Roles');
const Authorization = require('./../Server/Authorization');
const ValidationData = require('./../Server/ValidationData');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class Companies {
  /**
    * 
    */
  static async Post(message) {
    if(!(await ValidationData.CompaniesPost(message))) return {error: "Bad data"};

    let token = await Authorization.TokenInfo(message);
    if(!token.token_verify) return {error: "Bad token"};

    if(!(await Roles.PermissionsCompanies(message, token.token_info.role))) return {error: "Permission denied"};

    let data = "OK";

    if(message.body.type_request == 'companies_change') {
      for(let i = 0; i < message.body.companies.length; i++) {
        await Mysql.ParameterChange(`skos`, `Companies`, message.body.companies[i].status, [
            {name: 'id', data: message.body.companies[i].id, type: 'INT'},
            {name: 'id_direction', data: message.body.companies[i].id_direction, type: 'INT'},
            {name: 'name', data: message.body.companies[i].name, type: 'STRING'}
        ]);
      }
    }
    else if (message.body.type_request == 'companies_info') {
      if(typeof message.body.id_direction != "undefined")
          data = await Mysql.Request(`skos`, `SELECT id,name,id_direction FROM Companies WHERE id_direction=${message.body.id_direction};`);
      else data = await Mysql.Request(`skos`, "SELECT id,name,id_direction FROM Companies;");
    }
    return data;
}
}

//-----------Экспортируемые модули-----------//
module.exports = Companies;
//-----------Экспортируемые модули-----------//