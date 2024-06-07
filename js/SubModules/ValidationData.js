//-----------Подключаемые модули-----------//
//-----------Подключаемые модули-----------//

/**
 * Класс для проверки данных на валидность
 */
class ValidationData {
  static async Login(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.login == "undefined") return false;
    if(typeof message.body.password == "undefined") return false;

    if(message.body.login.length < 3 || message.body.login.length > 32) return false;
    if(message.body.password.length < 3 || message.body.password.length > 256) return false;

    if((message.body.login.toLowerCase()).indexOf('/') != -1) return false;
    if((message.body.login.toLowerCase()).indexOf(',') != -1) return false;
    if((message.body.login.toLowerCase()).indexOf('.') != -1) return false;
    if((message.body.login.toLowerCase()).indexOf('-') != -1) return false;

    if(!(await ValidationData.CheckAbsenseSqlInjectionSTRING(message.body.login))) return false;
    if(!(await ValidationData.CheckAbsenseSqlInjectionSTRING(message.body.password))) return false;

    return true;
  }

  static async TokenVerify(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.jwt == "undefined") return false;

    if(!(await ValidationData.CheckAbsenseSqlInjectionSTRING(message.body.jwt))) return false;

    return true;
  }

  static async TokenInfo(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.jwt == "undefined") return false;

    if(!(await ValidationData.CheckAbsenseSqlInjectionSTRING(message.body.jwt))) return false;

    return true;
  }

  static async ProfessionGroups(message) {
    if(typeof message.id_profession == "undefined") return false;
    
    message.id_profession = parseInt(message.id_profession);
    if(message.id_profession !== message.id_profession) return false;
    if(message.id_profession < 1 || message.id_profession > 2147483647) return false;
    message.id_profession = `${message.id_profession}`;

    return true;
  }

  static async TablePost(message) {
    if(typeof message.body == "undefined") return false;

    if(typeof message.body.request_type == "undefined") return false;
    if(message.body.request_type == "VIEW") {

    }
    else if(message.body.request_type == "VIEW_STATEMENT") {

    }
    else if(message.body.request_type == "SAVE") {
      if(typeof message.body.training_list != "undefined" && Array.isArray(message.body.training_list)) {
        message.body.training_list.forEach((profession) => {
          if(typeof profession.id_profession == "undefined" || profession.id_profession === "") profession.id_profession = null;
          
          if(typeof profession.profession_groups != "undefined" && Array.isArray(profession.profession_groups)) {
            profession.profession_groups.forEach((group) => {
              if(typeof group.id_PG == "undefined" || group.id_PG === "") group.id_PG = null;
              if(typeof group.date_start_training == "undefined" || group.date_start_training === "") group.date_start_training = null;
              else group.date_start_training = `\"${group.date_start_training}\"`;
              if(typeof group.date_start_industrial_training == "undefined" || group.date_start_industrial_training === "") group.date_start_industrial_training = null;
              else group.date_start_industrial_training = `\"${group.date_start_industrial_training}\"`;
              if(typeof group.date_end_industrial_training == "undefined" || group.date_end_industrial_training === "") group.date_end_industrial_training = null;
              else group.date_end_industrial_training = `\"${group.date_end_industrial_training}\"`;
              if(typeof group.date_exam == "undefined" || group.date_exam === "") group.date_exam = null;
              else group.date_exam = `\"${group.date_exam}\"`;
            });
          }
        });
      }
    }
    else if(message.body.request_type == "SAVE_STATEMENT") {

    }
    else return false;

    return true;
  }

  static async CheckAbsenseSqlInjectionINT(param) {
    if(typeof param == 'string') return false;

    if((param.toLowerCase()).indexOf('select') != -1) return false;
    if((param.toLowerCase()).indexOf('insert') != -1) return false;
    if((param.toLowerCase()).indexOf('delete') != -1) return false;
    if((param.toLowerCase()).indexOf('update') != -1) return false;

    return true;
  }

  static async CheckAbsenseSqlInjectionSTRING(param) {
    if(typeof param != 'string') return false;

    if((param.toLowerCase()).indexOf('\\') != -1) return false;
    
    return true;
  }
}

//-----------Экспортируемые модули-----------//
module.exports = ValidationData;
//-----------Экспортируемые модули-----------//