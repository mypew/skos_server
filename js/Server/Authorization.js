//-----------Подключаемые модули-----------//
const bcrypt = require('bcrypt');
const Mysql = require('./../DataBase/Mysql');
const ValidationData = require('./ValidationData');
const fs = require('fs');
const jwt = require('jsonwebtoken');
//-----------Подключаемые модули-----------//

/**
 * Класс, отвечающий за авторизацию
 */
class Authorization {
  static async Registration(message) {
    
  }

  static async Login(message) {
    if(!(await ValidationData.Login(message))) return {error: "Bad data"};

    let user = await Mysql.Request(`skos_users`, `SELECT login,password,role From Users WHERE login="${message.body.login}";`);

    if(user.length) {
      user = user[0];
      if(user.password != message.body.password) return {error: "Wrong password"};

      let payload = {login: user.login, role: user.role};
      let secret_key = fs.readFileSync(__dirname + '/../../.key/jwt_secret.key').toString();

      return {jwt: jwt.sign(payload, secret_key, {expiresIn: "24h"})};
    }
    else {
      return {error: "User not found"};
    }
  }

  static async TokenVerify(message) {
    if(!(await ValidationData.TokenVerify(message))) return {token_verify: false};

    let token = message.body.jwt;
    let secret_key = fs.readFileSync(__dirname + '/../../.key/jwt_secret.key').toString();

    try {
      console.log(jwt.verify(token, secret_key));
      return {token_verify: true};
    } catch(err) {
      return {token_verify: false};
    }
  }

  static async TokenInfo(message) {
    if(!(await ValidationData.TokenInfo(message))) return {token_verify: false};

    let token = message.body.jwt;
    let secret_key = fs.readFileSync(__dirname + '/../../.key/jwt_secret.key').toString();

    try {
      let token_info = jwt.verify(token, secret_key);
      return {token_verify: true, token_info: token_info};
    } catch(err) {
      return {token_verify: false};
    }
  }
}

//-----------Экспортируемые модули-----------//
module.exports = Authorization;
//-----------Экспортируемые модули-----------//