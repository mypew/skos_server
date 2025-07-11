//-----------Подключаемые модули-----------//
const Mysql = require('./../DataBase/Mysql');
//-----------Подключаемые модули-----------//

/**
 * Класс для проверки данных на валидность
 */
class ValidationData {
  static async ExcelPost(message) {
    if(typeof message.body.from_date != "undefined") message.body.from_date = new Date(message.body.from_date);
    if(typeof message.body.to_date != "undefined") message.body.to_date = new Date(message.body.to_date);

    return true;
  }

  static async PdfPost(message) {
    if(typeof message.body.from_date != "undefined") message.body.from_date = new Date(message.body.from_date);
    if(typeof message.body.to_date != "undefined") message.body.to_date = new Date(message.body.to_date);

    return true;
  }

  static async RolesPost(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.jwt == "undefined") return false;
    if(typeof message.body.type_request == "undefined") return false;

    if(message.body.type_request == 'role_info') {
      
    } else if(message.body.type_request == 'roles_info') {
      
    } else if(message.body.type_request == 'roles_change') {
      if(typeof message.body.roles == "undefined") return false;
      for(let i = 0; i < message.body.roles.length; i++) {
        if(typeof message.body.roles[i].status == "undefined") return false;
        if(message.body.roles[i].status == 0) {
          if(typeof message.body.roles[i].id == "undefined") return false;
          message.body.roles[i].name = '';
          message.body.roles[i].perm_admin_panel = '';
          message.body.roles[i].perm_directions = '';
          message.body.roles[i].perm_companies = '';
          message.body.roles[i].perm_divisions = '';
          message.body.roles[i].perm_profession_groups = '';
          message.body.roles[i].perm_professions = '';
          message.body.roles[i].perm_sections = '';
          message.body.roles[i].perm_roles = '';
          message.body.roles[i].perm_users = '';
          message.body.roles[i].perm_notifications = '';
          message.body.roles[i].perm_plan_schedule = '';
          message.body.roles[i].perm_statement = '';
          message.body.roles[i].perm_positions = '';
        } else if(message.body.roles[i].status == 1) {
          if(typeof message.body.roles[i].id == "undefined") return false;
          if(typeof message.body.roles[i].name == "undefined") return false;
          if(typeof message.body.roles[i].perm_admin_panel == "undefined") return false;
          if(typeof message.body.roles[i].perm_directions == "undefined") return false;
          if(typeof message.body.roles[i].perm_companies == "undefined") return false;
          if(typeof message.body.roles[i].perm_divisions == "undefined") return false;
          if(typeof message.body.roles[i].perm_profession_groups == "undefined") return false;
          if(typeof message.body.roles[i].perm_professions == "undefined") return false;
          if(typeof message.body.roles[i].perm_sections == "undefined") return false;
          if(typeof message.body.roles[i].perm_roles == "undefined") return false;
          if(typeof message.body.roles[i].perm_users == "undefined") return false;
          if(typeof message.body.roles[i].perm_notifications == "undefined") return false;
          if(typeof message.body.roles[i].perm_plan_schedule == "undefined") return false;
          if(typeof message.body.roles[i].perm_statement == "undefined") return false;
          if(typeof message.body.roles[i].perm_positions == "undefined") return false;
        } else if(message.body.roles[i].status == 2) {
          if(typeof message.body.roles[i].id == "undefined") message.body.roles[i].id = null;
          if(typeof message.body.roles[i].name == "undefined") return false;
          if(typeof message.body.roles[i].perm_admin_panel == "undefined") message.body.roles[i].perm_admin_panel = {'access': '-'};
          if(typeof message.body.roles[i].perm_directions == "undefined") message.body.roles[i].perm_directions = {'access': '-'};
          if(typeof message.body.roles[i].perm_companies == "undefined") message.body.roles[i].perm_companies = {'access': '-'};
          if(typeof message.body.roles[i].perm_divisions == "undefined") message.body.roles[i].perm_divisions = {'access': '-'};
          if(typeof message.body.roles[i].perm_profession_groups == "undefined") message.body.roles[i].perm_profession_groups = {'access': '-'};
          if(typeof message.body.roles[i].perm_professions == "undefined") message.body.roles[i].perm_professions = {'access': '-'};
          if(typeof message.body.roles[i].perm_sections == "undefined") message.body.roles[i].perm_sections = {'access': '-'};
          if(typeof message.body.roles[i].perm_roles == "undefined") message.body.roles[i].perm_roles = {'access': '-'};
          if(typeof message.body.roles[i].perm_users == "undefined") message.body.roles[i].perm_users = {'access': '-'};
          if(typeof message.body.roles[i].perm_notifications == "undefined") message.body.roles[i].perm_notifications = {'access': '-'};
          if(typeof message.body.roles[i].perm_plan_schedule == "undefined") message.body.roles[i].perm_plan_schedule = {'access': '-'};
          if(typeof message.body.roles[i].perm_statement == "undefined") message.body.roles[i].perm_statement = {'access': '-'};
          if(typeof message.body.roles[i].perm_positions == "undefined") message.body.roles[i].perm_positions = {'access': '-'};
        } else return false;
      }
    } else return false;
    
    return true;
  }

  static async Login(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.login == "undefined") return false;
    if(typeof message.body.password == "undefined") return false;

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

  static async ProfessionGroupsGet(message) {
    if(typeof message.id_profession == "undefined") return false;
    
    message.id_profession = parseInt(message.id_profession);
    if(message.id_profession !== message.id_profession) return false;
    if(message.id_profession < 1 || message.id_profession > 2147483647) return false;
    message.id_profession = `${message.id_profession}`;

    return true;
  }

  static async ProfessionsGet(message) {
    if(typeof message.type == "undefined") message.type = 'normal';

    return true;
  }

  static async NotificationsPost(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.jwt == "undefined") return false;
    if(typeof message.body.type_request == "undefined") return false;

    if(message.body.type_request == 'notifications_change') {
      if(typeof message.body.notifications == "undefined") return false;

      for(let i = 0; i < message.body.notifications.length; i++) {
        if(typeof message.body.notifications[i].status == "undefined") return false;
        if(typeof message.body.notifications[i].status_perm == "undefined") return false;

        if(message.body.notifications[i].status == 1 && message.body.notifications[i].status_perm != 3) {
          if(typeof message.body.notifications[i].id == "undefined") return false;
          if(typeof message.body.notifications[i].status_notification == "undefined") return false;
          if(typeof message.body.notifications[i].date_reading == "undefined") return false;
          if(typeof message.body.notifications[i].companies == "undefined") return false;

          for(let j = 0; j < message.body.notifications[i].companies.length; j++) {
            if(typeof message.body.notifications[i].companies[j].status == "undefined") message.body.notifications[i].companies[j].status = -1;

            if(message.body.notifications[i].companies[j].status == 0) {
              if(typeof message.body.notifications[i].companies[j].id == "undefined") return false;
            }
            else if(message.body.notifications[i].companies[j].status == 1) {
              if(typeof message.body.notifications[i].companies[j].id == "undefined") return false;
              if(typeof message.body.notifications[i].companies[j].id_company == "undefined") return false;
              if(typeof message.body.notifications[i].companies[j].count_people == "undefined") return false;
              if(typeof message.body.notifications[i].companies[j].telegram == "undefined") return false;
              if(typeof message.body.notifications[i].companies[j].writ == "undefined") return false;
            }
            else if(message.body.notifications[i].companies[j].status == 2) {
              if(typeof message.body.notifications[i].companies[j].id == "undefined") message.body.notifications[i].companies[j].id = null;
              if(typeof message.body.notifications[i].companies[j].id_company == "undefined") return false;
              if(typeof message.body.notifications[i].companies[j].count_people == "undefined") return false;
              if(typeof message.body.notifications[i].companies[j].telegram == "undefined") return false;
              if(typeof message.body.notifications[i].companies[j].writ == "undefined") return false;
            }
          }
        }
        else if (message.body.notifications[i].status == 1 && message.body.notifications[i].status_perm == 3) {

        }
        else return false;
      }
    }
    else if(message.body.type_request == 'notifications_plan_change') {
      if(typeof message.body.notifications_plan == "undefined") return false;
      for(let i = 0; i < message.body.notifications_plan.length; i++) {
        if(typeof message.body.notifications_plan[i].status == "undefined") return false;

        if(message.body.notifications_plan[i].status == 0) {
          if(typeof message.body.notifications_plan[i].id == "undefined") return false;
          message.body.notifications_plan[i].days = null;
          message.body.notifications_plan[i].count_notifications = null;
          message.body.notifications_plan[i].type = null;
          message.body.notifications_plan[i].id_role = null;
        }
        else if(message.body.notifications_plan[i].status == 1) {
          if(typeof message.body.notifications_plan[i].id == "undefined") return false;
          if(typeof message.body.notifications_plan[i].days == "undefined") return false;
          if(typeof message.body.notifications_plan[i].count_notifications == "undefined") return false;
          if(typeof message.body.notifications_plan[i].type == "undefined") return false;
          if(typeof message.body.notifications_plan[i].id_role == "undefined") return false;
        }
        else if(message.body.notifications_plan[i].status == 2) {
          message.body.notifications_plan[i].id = null;
          if(typeof message.body.notifications_plan[i].days == "undefined") return false;
          if(typeof message.body.notifications_plan[i].count_notifications == "undefined") return false;
          if(typeof message.body.notifications_plan[i].type == "undefined") return false;
          if(typeof message.body.notifications_plan[i].id_role == "undefined") return false;
        }
        else return false;
      }
    }

    return true;
  }

  static async DocxPost(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.jwt == "undefined") return false;
    if(typeof message.body.type_request == "undefined") return false;

    if(message.body.type_request == 'Generate') {
      if(typeof message.body.form == "undefined") return false;
    }

    return true;
  }

  static async DirectionsPost(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.jwt == "undefined") return false;
    if(typeof message.body.type_request == "undefined") return false;

    if(message.body.type_request == 'directions_change') {
      if(typeof message.body.directions == "undefined") return false;
      for(let i = 0; i < message.body.directions.length; i++) {
        if(typeof message.body.directions[i].status == "undefined") return false;
        if(typeof message.body.directions[i].name == "undefined") return false;

        if(message.body.directions[i].status == 0 || message.body.directions[i].status == 1) {
          if(typeof message.body.directions[i].id == "undefined") return false;
        }
        else message.body.directions[i].id = null;
      }
    }

    return true;
  }

  static async DivisionsPost(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.jwt == "undefined") return false;
    if(typeof message.body.type_request == "undefined") return false;

    if(message.body.type_request == 'divisions_change') {
      if(typeof message.body.divisions == "undefined") return false;
      for(let i = 0; i < message.body.divisions.length; i++) {
        if(typeof message.body.divisions[i].status == "undefined") return false;
        if(typeof message.body.divisions[i].name == "undefined") return false;

        if(message.body.divisions[i].status == 0 || message.body.divisions[i].status == 1) {
          if(typeof message.body.divisions[i].id == "undefined") return false;
        }
        else message.body.divisions[i].id = null;
      }
    }

    return true;
  }

  static async PositionsPost(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.jwt == "undefined") return false;
    if(typeof message.body.type_request == "undefined") return false;

    if(message.body.type_request == 'positions_change') {
      if(typeof message.body.positions == "undefined") return false;
      for(let i = 0; i < message.body.positions.length; i++) {
        if(typeof message.body.positions[i].status == "undefined") return false;
        if(typeof message.body.positions[i].name == "undefined") return false;

        if(message.body.positions[i].status == 0 || message.body.positions[i].status == 1) {
          if(typeof message.body.positions[i].id == "undefined") return false;
        }
        else message.body.positions[i].id = null;
      }
    }

    return true;
  }

  static async CompaniesPost(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.jwt == "undefined") return false;
    if(typeof message.body.type_request == "undefined") return false;

    if(message.body.type_request == 'companies_change') {
      if(typeof message.body.companies == "undefined") return false;
      for(let i = 0; i < message.body.companies.length; i++) {
        if(typeof message.body.companies[i].status == "undefined") return false;

        if(message.body.companies[i].status == 0) {
          if(typeof message.body.companies[i].id == "undefined") return false;
          if(typeof message.body.companies[i].name == "undefined") message.body.companies[i].name = null;
          if(typeof message.body.companies[i].id_direction == "undefined") message.body.companies[i].id_direction = null;
        }
        else if (message.body.companies[i].status == 1) {
          if(typeof message.body.companies[i].id == "undefined") return false;
          if(typeof message.body.companies[i].name == "undefined") return false;
          if(typeof message.body.companies[i].id_direction == "undefined") return false;
        }
        else if (message.body.companies[i].status == 2) {
          if(typeof message.body.companies[i].id == "undefined") message.body.companies[i].id = null;
          if(typeof message.body.companies[i].name == "undefined") return false;
          if(typeof message.body.companies[i].id_direction == "undefined") return false;
        }
      }
    }

    return true;
  }

  static async ProfessionGroupsPost(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.jwt == "undefined") return false;
    if(typeof message.body.type_request == "undefined") return false;

    if(message.body.type_request == 'profession_groups_change') {
      if(typeof message.body.profession_groups == "undefined") return false;
      for(let i = 0; i < message.body.profession_groups.length; i++) {
        if(typeof message.body.profession_groups[i].status == "undefined") return false;
        if(typeof message.body.profession_groups[i].name == "undefined") return false;

        if(message.body.profession_groups[i].status == 0 || message.body.profession_groups[i].status == 1) {
          if(typeof message.body.profession_groups[i].id == "undefined") return false;
        }
        else message.body.profession_groups[i].id = null;

        if(message.body.profession_groups[i].status == 1 || message.body.profession_groups[i].status == 2) {
          if(typeof message.body.profession_groups[i].id_profession == "undefined") return false;
        }
        else message.body.profession_groups[i].id_profession = null;
      }
    }

    return true;
  }

  static async ProfessionsPost(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.jwt == "undefined") return false;
    if(typeof message.body.type_request == "undefined") return false;

    if(message.body.type_request == 'professions_change') {
      if(typeof message.body.professions == "undefined") return false;
      for(let i = 0; i < message.body.professions.length; i++) {
        if(typeof message.body.professions[i].status == "undefined") return false;
        if(typeof message.body.professions[i].name == "undefined") return false;

        if(message.body.professions[i].status == 0 || message.body.professions[i].status == 1) {
          if(typeof message.body.professions[i].id == "undefined") return false;
        }
        else message.body.professions[i].id = null;
      }
    }
    else if(message.body.type_request == 'professions_info') {
      if(typeof message.body.type_info == "undefined") return false;
    }

    return true;
  }

  static async SectionsPost(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.jwt == "undefined") return false;
    if(typeof message.body.type_request == "undefined") return false;

    if(message.body.type_request == 'sections_change') {
      if(typeof message.body.sections == "undefined") return false;
      for(let i = 0; i < message.body.sections.length; i++) {
        if(typeof message.body.sections[i].status == "undefined") return false;
        if(typeof message.body.sections[i].name == "undefined") return false;

        if(message.body.sections[i].status == 0 || message.body.sections[i].status == 1) {
          if(typeof message.body.sections[i].id == "undefined") return false;
        }
        else message.body.sections[i].id = null;
      }
    }

    return true;
  }

  static async UserPost(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.type_request == "undefined") message.body.type_request = 'user_info';
    if(typeof message.body.jwt == "undefined") return false;

    if(message.body.type_request == 'user_change') {
      if(typeof message.body.user == "undefined") return false;
      if(typeof message.body.user.login == "undefined" || message.body.user.login == null) return false;
      if(typeof message.body.user.status == "undefined") return false;
      if(message.body.user.status == 0) {
        message.body.user.password = '';
        message.body.user.role = null;
        message.body.user.surname = '';
        message.body.user.name = '';
        message.body.user.patronymic = '';
        message.body.user.phone_number = '';
        message.body.user.id_direction = null;
        message.body.user.id_division = null;
        message.body.user.id_profession = null;
        message.body.user.id_company = null;
        message.body.user.id_position = null;
      } else if(message.body.user.status == 1) {
        if(typeof message.body.user.password == "undefined" || message.body.user.password == null) message.body.user.password = -1;
        if(typeof message.body.user.role == "undefined" || message.body.user.role == null) return false;
        if(typeof message.body.user.surname == "undefined" || message.body.user.surname == null) return false;
        if(typeof message.body.user.name == "undefined" || message.body.user.name == null) return false;
        if(typeof message.body.user.patronymic == "undefined") return false;
        if(typeof message.body.user.phone_number == "undefined" || message.body.user.phone_number == null) return false;
        if(typeof message.body.user.id_direction == "undefined") return false;
        if(typeof message.body.user.id_division == "undefined") return false;
        if(typeof message.body.user.id_profession == "undefined") return false;
        if(typeof message.body.user.id_company == "undefined") return false;
        if(typeof message.body.user.id_position == "undefined") return false;
      } else if (message.body.user.status == 2) {
        if(typeof message.body.user.password == "undefined" || message.body.user.password == null) return false;
        if(message.body.user.login.length < 3 || message.body.user.login.length > 32) return false;
        if((message.body.user.login.toLowerCase()).indexOf('/') != -1) return false;
        if((message.body.user.login.toLowerCase()).indexOf(',') != -1) return false;
        if((message.body.user.login.toLowerCase()).indexOf('.') != -1) return false;
        if((message.body.user.login.toLowerCase()).indexOf('-') != -1) return false;
        if(message.body.user.password.length < 3 || message.body.user.password.length > 256) return false;
        if(typeof message.body.user.role == "undefined" || message.body.user.role == null) return false;
        if(typeof message.body.user.surname == "undefined" || message.body.user.surname == null) return false;
        if(typeof message.body.user.name == "undefined" || message.body.user.name == null) return false;
        if(typeof message.body.user.patronymic == "undefined") return false;
        if(typeof message.body.user.phone_number == "undefined" || message.body.user.phone_number == null) return false;
        if(typeof message.body.user.id_direction == "undefined") message.body.user.id_direction = null;
        if(typeof message.body.user.id_division == "undefined") message.body.user.id_division = null;
        if(typeof message.body.user.id_profession == "undefined") message.body.user.id_profession = null;
        if(typeof message.body.user.id_company == "undefined") message.body.user.id_company = null;
        if(typeof message.body.user.id_position == "undefined") message.body.user.id_position = null;
      } else return false;
    }

    return true;
  }

  static async TablePost(message) {
    if(typeof message.body == "undefined") return false;
    if(typeof message.body.jwt == "undefined") return false;

    if(typeof message.body.type_request == "undefined") return false;
    if(typeof message.body.from_date != "undefined") message.body.from_date = new Date(message.body.from_date);
    if(typeof message.body.to_date != "undefined") message.body.to_date = new Date(message.body.to_date);
    if(message.body.type_request == "VIEW") {

    }
    else if(message.body.type_request == "VIEW_STATEMENT") {

    }
    else if(message.body.type_request == "SAVE") {
      if(typeof message.body.training_list != "undefined" && Array.isArray(message.body.training_list)) {
        message.body.training_list.forEach((profession) => {
          if(typeof profession.id_profession == "undefined" || profession.id_profession === "") profession.id_profession = null;
          if(typeof profession.profession_groups != "undefined" && Array.isArray(profession.profession_groups)) {
            profession.profession_groups.forEach((group) => {
              if(typeof group.id_PG == "undefined" || group.id_PG === "") group.id_PG = null;
            });
          }
          if(typeof profession.directions != "undefined") {
            profession.directions.forEach((direction) => {
              if(typeof direction.id_direction == "undefined" || direction.id_direction == '') {
                direction.id_direction = null;
              }
            });
          }
        });
      }
    }
    else if(message.body.type_request == "SAVE_STATEMENT") {

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