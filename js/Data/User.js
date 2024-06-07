//-----------Подключаемые модули-----------//
const Mysql = require('./Mysql');
const Authorization = require('./../Server/Authorization');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class User {
  /**
    * 
    */
  static async Post(message) {
    let token = await Authorization.TokenInfo(message);
    if(!token.token_verify) return {error: "Bad data"};

    let user = (await Mysql.Request(`skos_users`, `SELECT surname,name,patronymic,phone_number FROM Users WHERE login="${token.token_info.login}";`))[0];
    user.role_name = (await Mysql.Request(`skos`, `SELECT name FROM Roles WHERE id="${token.token_info.role}";`))[0].name;

    return user;
  }
}

//-----------Экспортируемые модули-----------//
module.exports = User;
//-----------Экспортируемые модули-----------//