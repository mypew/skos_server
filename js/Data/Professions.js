//-----------Подключаемые модули-----------//
const Mysql = require('./../DataBase/Mysql');
const Roles = require('./Roles');
const Authorization = require('./../Server/Authorization');
const ValidationData = require('./../Server/ValidationData');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class Professions {
    /**
    * 
    */
    static async Get(message) {
        if(!(await ValidationData.ProfessionsGet(message))) return {error: "Bad data"};

        let data = 'OK';

        if(message.type == 'normal') {
            data = await Mysql.Request(`skos`, "SELECT id,name FROM Professions;");
        }
        else if(message.type == 'full') {
            data = await Mysql.Request(`skos`, "SELECT id,name FROM Professions;");
            for(let i = 0; i < data.length; i++) {
                data[i].groups = await Mysql.Request(`skos`, `SELECT id,name FROM ProfessionGroups WHERE id_profession=${data[i].id};`);
            }
        } else {
            return {error: "Bad data"};
        }

        return data;
    }

    /**
    * 
    */
    static async Post(message) {
        if(!(await ValidationData.ProfessionsPost(message))) return {error: "Bad data"};

        let token = await Authorization.TokenInfo(message);
        if(!token.token_verify) return {error: "Bad token"};

        if(!(await Roles.PermissionsProfessions(message, token.token_info.role))) return {error: "Permission denied"};

        let data = "OK";

        if(message.body.type_request == 'professions_change') {
            for(let i = 0; i < message.body.professions.length; i++) {
                await Mysql.ParameterChange(`skos`, `Professions`, message.body.professions[i].status, [
                    {name: 'id', data: message.body.professions[i].id, type: 'INT'},
                    {name: 'name', data: message.body.professions[i].name, type: 'STRING'}
                ]);
            }
        }
        if(message.body.type_request == 'professions_info') {
            if(typeof message.body.id_profession != "undefined") {
                if(message.body.type_info == 'normal') {
                    data = await Mysql.Request(`skos`, `SELECT id,name FROM Professions WHERE id=${message.body.id_profession};`);
                }
                else if(message.body.type_info == 'full') {
                    data = await Mysql.Request(`skos`, `SELECT id,name FROM Professions WHERE id=${message.body.id_profession};`);
                    for(let i = 0; i < data.length; i++) {
                        data[i].groups = await Mysql.Request(`skos`, `SELECT id,name FROM ProfessionGroups WHERE id_profession=${data[i].id};`);
                    }
                }
            }
            else {
                if(message.body.type_info == 'normal') {
                    data = await Mysql.Request(`skos`, "SELECT id,name FROM Professions;");
                }
                else if(message.body.type_info == 'full') {
                    data = await Mysql.Request(`skos`, "SELECT id,name FROM Professions;");
                    for(let i = 0; i < data.length; i++) {
                        data[i].groups = await Mysql.Request(`skos`, `SELECT id,name FROM ProfessionGroups WHERE id_profession=${data[i].id};`);
                    }
                }
            }
        }
        return data;
    }
}

//-----------Экспортируемые модули-----------//
module.exports = Professions;
//-----------Экспортируемые модули-----------//