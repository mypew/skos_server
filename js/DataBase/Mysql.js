//-----------Подключаемые модули-----------//
const mysql = require('mysql2');
//-----------Подключаемые модули-----------//

/**
 * Класс для работы с базой данных Mysql
 */
class Mysql {
    static databases = {
        skos: {
            host: "localhost",
            user: "skos_admin",
            password: 'Pi8*hh_NoAya'
        },
        skos_users: {
            host: "localhost",
            user: "skos_admin",
            password: 'Pi8*hh_NoAya'
        }
    }

    /** 
     * Асинхронная функция, которая отправляет SQL команду в mysql по данным из переменной connection
     */
    static async Request(database, command) {
        let connection = await this.NewConnection(database);
        let result = "null";
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

        connection.connect();
        connection.query(command, function (error, results, fields) {
            if (error) {
                console.log(error);
                result = "Error request";
            } else {
            result = results;
            }
        });
        connection.end();

        while (result == "null") {
            await delay(5);
        }

        return result;
    }

    /**
     * Функция, которая создаёт переменную, через которую мы общаемся с базой данных
     */
    static async NewConnection(database) {
        /** Переменная, через которую мы общаемся с базой данных */
        let connection = mysql.createConnection({
            database: database,
            host: this.databases[database].host,
            user: this.databases[database].user,
            password: this.databases[database].password,
        });
        return connection;
    }

    static async ParameterChange(database, table, type, params) {
        let sql = ``;

        if(params.length == 0) return false;

        for(let i = 0; i < params.length; i++) {
            if(params[i].type == 'STRING' && params[i].data == '') {
                params[i].data = null;
            }
            else if(params[i].type == 'STRING' && params[i].data != null) {
                params[i].data = `'${params[i].data}'`;
            }
        }

        if(type == 0) {
            sql = `DELETE FROM ${table} WHERE ${params[0].name}=${params[0].data}`;
        } else if(type == 1) {
            sql = `UPDATE ${table} SET`;
            sql += ` ${params[1].name}=${params[1].data}`;
            for(let i = 2; i < params.length; i++) {
                sql += `, ${params[i].name}=${params[i].data}`;
            }
            sql += ` WHERE ${params[0].name}=${params[0].data}`;
        } else if(type == 2) {
            sql = `INSERT INTO ${table}(`;
            if(params[0].type == 'INT' && params[0].data == -1) {
                sql += `${params[1].name}`;
                for(let i = 2; i < params.length; i++) {
                    sql += `,${params[i].name}`;
                }
                sql += `) VALUES(`;
                sql += `${params[1].data}`;
                for(let i = 2; i < params.length; i++) {
                    sql += `,${params[i].data}`;
                }
                sql += `)`;
            } else {
                sql += `${params[0].name}`;
                for(let i = 1; i < params.length; i++) {
                    sql += `,${params[i].name}`;
                }
                sql += `) VALUES(`;
                sql += `${params[0].data}`;
                for(let i = 1; i < params.length; i++) {
                    sql += `,${params[i].data}`;
                }
                sql += `)`;
            }
        } else return false;
        console.log(sql);

        return Mysql.Request(database, sql + ';');
    }
}

//-----------Экспортируемые модули-----------//
module.exports = Mysql;
//-----------Экспортируемые модули-----------//