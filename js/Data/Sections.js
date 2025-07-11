//-----------Подключаемые модули-----------//
const Mysql = require('./../DataBase/Mysql');
const Roles = require('./Roles');
const Authorization = require('./../Server/Authorization');
const ValidationData = require('./../Server/ValidationData');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class Sections {
    /**
     * 
     */
    static async Get(message) {
        let data = await Mysql.Request(`skos`, "SELECT id,name FROM Sections;");
        return data;
    }

    /**
    * 
    */
    static async Post(message) {
        if(!(await ValidationData.SectionsPost(message))) return {error: "Bad data"};

        let token = await Authorization.TokenInfo(message);
        if(!token.token_verify) return {error: "Bad token"};

        if(!(await Roles.PermissionsSections(message, token.token_info.role))) return {error: "Permission denied"};

        let data = "OK";

        if(message.body.type_request == 'sections_change') {
            for(let i = 0; i < message.body.sections.length; i++) {
                await Mysql.ParameterChange(`skos`, `Sections`, message.body.sections[i].status, [
                    {name: 'id', data: message.body.sections[i].id, type: 'INT'},
                    {name: 'name', data: message.body.sections[i].name, type: 'STRING'}
                ]);
            }
        }
        else if(message.body.type_request == 'sections_info') {
            if(typeof message.body.id_section!= "undefined")
                data = await Mysql.Request(`skos`, `SELECT id,name FROM Sections WHERE id=${message.body.id_section};`);
            else data = await Mysql.Request(`skos`, "SELECT id,name FROM Sections;");
        }

        return data;
    }
}

//-----------Экспортируемые модули-----------//
module.exports = Sections;
//-----------Экспортируемые модули-----------//