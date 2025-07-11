//-----------Подключаемые модули-----------//
const Mysql = require('./../DataBase/Mysql');
const Roles = require('./Roles');
const Authorization = require('./../Server/Authorization');
const ValidationData = require('./../Server/ValidationData');
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

    /**
    * 
    */
    static async Post(message) {
        if(!(await ValidationData.DirectionsPost(message))) return {error: "Bad data"};

        let token = await Authorization.TokenInfo(message);
        if(!token.token_verify) return {error: "Bad token"};

        if(!(await Roles.PermissionsDirections(message, token.token_info.role))) return {error: "Permission denied"};

        let data = "OK";

        if(message.body.type_request == 'directions_change') {
            for(let i = 0; i < message.body.directions.length; i++) {
                await Mysql.ParameterChange(`skos`, `Directions`, message.body.directions[i].status, [
                    {name: 'id', data: message.body.directions[i].id, type: 'INT'},
                    {name: 'name', data: message.body.directions[i].name, type: 'STRING'}
                ]);
            }
        }
        else if (message.body.type_request == 'directions_info') {
            if(typeof message.body.id_direction != "undefined")
                data = await Mysql.Request(`skos`, `SELECT id,name FROM Directions WHERE id=${message.body.id_direction};`);
            else data = await Mysql.Request(`skos`, "SELECT id,name FROM Directions;");
        }

        return data;
    }
}

//-----------Экспортируемые модули-----------//
module.exports = Directions;
//-----------Экспортируемые модули-----------//