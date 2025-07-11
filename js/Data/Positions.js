//-----------Подключаемые модули-----------//
const Mysql = require('./../DataBase/Mysql');
const Roles = require('./Roles');
const Authorization = require('./../Server/Authorization');
const ValidationData = require('./../Server/ValidationData');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class Positions {
    /**
    * 
    */
    static async Post(message) {
        if(!(await ValidationData.PositionsPost(message))) return {error: "Bad data"};

        let token = await Authorization.TokenInfo(message);
        if(!token.token_verify) return {error: "Bad token"};

        if(!(await Roles.PermissionsPositions(message, token.token_info.role))) return {error: "Permission denied"};

        let data = "OK";

        if(message.body.type_request == 'positions_change') {
            for(let i = 0; i < message.body.positions.length; i++) {
                await Mysql.ParameterChange(`skos`, `Positions`, message.body.positions[i].status, [
                    {name: 'id', data: message.body.positions[i].id, type: 'INT'},
                    {name: 'name', data: message.body.positions[i].name, type: 'STRING'}
                ]);
            }
        }
        else if (message.body.type_request == 'positions_info') {
            if(typeof message.body.id_position != "undefined")
                data = await Mysql.Request(`skos`, `SELECT id,name FROM Positions WHERE id=${message.body.id_position};`);
            else data = await Mysql.Request(`skos`, "SELECT id,name FROM Positions;");
        }

        return data;
    }
}

//-----------Экспортируемые модули-----------//
module.exports = Positions;
//-----------Экспортируемые модули-----------//