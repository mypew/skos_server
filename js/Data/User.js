//-----------Подключаемые модули-----------//
const Mysql = require('./../DataBase/Mysql');
const Roles = require('./Roles');
const Authorization = require('./../Server/Authorization');
const ValidationData = require('./../Server/ValidationData');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class User {
  /**
    * 
    */
  static async Post(message) {
    if(!(await ValidationData.UserPost(message))) return {error: "Bad data"};
    
    let token = await Authorization.TokenInfo(message);
    if(!token.token_verify) return {error: "Bad token"};

    if(!(await Roles.PermissionsUsers(message, token.token_info.role, token.token_info.login))) return {error: "Permission denied"};

    let data = 'OK';

    if(message.body.type_request == 'user_info') {
      data = (await Mysql.Request(`skos_users`, `SELECT surname,name,patronymic,phone_number,role,id_direction,id_division,id_profession,id_company,id_position FROM Users WHERE login="${token.token_info.login}";`))[0];
      data.role_name = (await Mysql.Request(`skos`, `SELECT name FROM Roles WHERE id="${token.token_info.role}";`))[0].name;
    } else if(message.body.type_request == 'users_info') {
      data = await Mysql.Request(`skos_users`, `SELECT login,surname,name,patronymic,phone_number,role,id_direction,id_division,id_profession,id_company,id_position FROM Users;`);
    } else if(message.body.type_request == 'user_change') {
      if(message.body.user.password == -1)
        message.body.user.password = (await Mysql.Request(`skos_users`, `SELECT password FROM Users WHERE login="${message.body.user.login}";`))[0].password;

      await Mysql.ParameterChange(`skos_users`, `Users`, message.body.user.status, [
        {name: 'login', data: message.body.user.login, type: 'STRING'},
        {name: 'password', data: message.body.user.password, type: 'STRING'},
        {name: 'role', data: message.body.user.role, type: 'INT'},
        {name: 'surname', data: message.body.user.surname, type: 'STRING'},
        {name: 'name', data: message.body.user.name, type: 'STRING'},
        {name: 'patronymic', data: message.body.user.patronymic, type: 'STRING'},
        {name: 'phone_number', data: message.body.user.phone_number, type: 'STRING'},
        {name: 'id_direction', data: message.body.user.id_direction, type: 'INT'},
        {name: 'id_division', data: message.body.user.id_division, type: 'INT'},
        {name: 'id_profession', data: message.body.user.id_profession, type: 'INT'},
        {name: 'id_company', data: message.body.user.id_company, type: 'INT'},
        {name: 'id_position', data: message.body.user.id_position, type: 'INT'}
      ]);
    }

    return data;
  }

  /**
    * 
    */
  static async GetUser(login) {
    let user = (await Mysql.Request(`skos_users`, `SELECT surname,name,patronymic,phone_number,role,id_direction,id_division,id_profession,id_company,id_position FROM Users WHERE login="${login}";`))[0];
    user.role_name = (await Mysql.Request(`skos`, `SELECT name FROM Roles WHERE id="${user.role}";`))[0].name;
    user.perm = await Roles.GetRole(user.role);
    return user;
  }
}

//-----------Экспортируемые модули-----------//
module.exports = User;
//-----------Экспортируемые модули-----------//