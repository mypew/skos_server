//-----------Подключаемые модули-----------//
const Mysql = require('./../DataBase/Mysql');
const Roles = require('./Roles');
const Authorization = require('./../Server/Authorization');
const ValidationData = require('./../Server/ValidationData');
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

    /**
    * 
    */
    static async Post(message) {
        if(!(await ValidationData.DivisionsPost(message))) return {error: "Bad data"};

        let token = await Authorization.TokenInfo(message);
        if(!token.token_verify) return {error: "Bad token"};

        if(!(await Roles.PermissionsDivisions(message, token.token_info.role))) return {error: "Permission denied"};

        let data = "OK";

        if(message.body.type_request == 'divisions_change') {
            for(let i = 0; i < message.body.divisions.length; i++) {
                await Mysql.ParameterChange(`skos`, `Divisions`, message.body.divisions[i].status, [
                    {name: 'id', data: message.body.divisions[i].id, type: 'INT'},
                    {name: 'name', data: message.body.divisions[i].name, type: 'STRING'}
                ]);
            }
        }
        else if (message.body.type_request == 'divisions_info') {
            if(typeof message.body.id_division != "undefined")
                data = await Mysql.Request(`skos`, `SELECT id,name FROM Divisions WHERE id=${message.body.id_division};`);
            else data = await Mysql.Request(`skos`, "SELECT id,name FROM Divisions;");
        }

        return data;
    }
}

//-----------Экспортируемые модули-----------//
module.exports = Divisions;
//-----------Экспортируемые модули-----------//