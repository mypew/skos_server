//-----------Подключаемые модули-----------//
const Mysql = require('./../DataBase/Mysql');
const Authorization = require('./../Server/Authorization');
const ValidationData = require('./../Server/ValidationData');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class Roles {
  /**
  * 
  */
  static async Post(message) {
    if(!(await ValidationData.RolesPost(message))) return {error: "Bad data"};

    let token = await Authorization.TokenInfo(message);
    if(!token.token_verify) return {error: "Bad token"};

    if(!(await Roles.PermissionsRoles(message, token.token_info.role))) return {error: "Permission denied"};

    let data = "OK";

    if(message.body.type_request == 'role_info') {
      data = await Roles.GetRole(token.token_info.role);
    }
    if(message.body.type_request == 'roles_info') {
      data = await Mysql.Request(`skos`, `SELECT id FROM Roles;`);
      for(let i = 0; i < data.length; i++) {
        data[i] = await Roles.GetRole(data[i].id);
      }
    } else if(message.body.type_request == 'roles_change') {
      for(let i = 0; i < message.body.roles.length; i++) {
        message.body.roles[i] = await Roles.PermissionsStrInObj(message.body.roles[i]);
        await Mysql.ParameterChange(`skos`, `Roles`, message.body.roles[i].status, [
          {name: 'id', data: message.body.roles[i].id, type: 'INT'},
          {name: 'name', data: message.body.roles[i].name, type: 'STRING'},
          {name: 'perm_admin_panel', data: message.body.roles[i].perm_admin_panel, type: 'STRING'},
          {name: 'perm_directions', data: message.body.roles[i].perm_directions, type: 'STRING'},
          {name: 'perm_companies', data: message.body.roles[i].perm_companies, type: 'STRING'},
          {name: 'perm_divisions', data: message.body.roles[i].perm_divisions, type: 'STRING'},
          {name: 'perm_positions', data: message.body.roles[i].perm_positions, type: 'STRING'},
          {name: 'perm_profession_groups', data: message.body.roles[i].perm_profession_groups, type: 'STRING'},
          {name: 'perm_professions', data: message.body.roles[i].perm_professions, type: 'STRING'},
          {name: 'perm_sections', data: message.body.roles[i].perm_sections, type: 'STRING'},
          {name: 'perm_roles', data: message.body.roles[i].perm_roles, type: 'STRING'},
          {name: 'perm_users', data: message.body.roles[i].perm_users, type: 'STRING'},
          {name: 'perm_notifications', data: message.body.roles[i].perm_notifications, type: 'STRING'},
          {name: 'perm_plan_schedule', data: message.body.roles[i].perm_plan_schedule, type: 'STRING'},
          {name: 'perm_statement', data: message.body.roles[i].perm_statement, type: 'STRING'},
        ]);
      }
    }

    return data;
  }

  /**
  * 
  */
  static async PermissionsCompanies(message, role, login) {
    let permissions = await Roles.GetRole(role);
    let user = await Roles.GetUser(login);


    if(message.body.type_request == 'companies_change' && permissions.perm_admin_panel.access == '-') {
      return false;
    }
    else if(message.body.type_request == 'companies_info' && permissions.perm_companies.access == '-') {
      return false;
    }
    else if(message.body.type_request == 'companies_info' && permissions.perm_companies.access == 'limited') {
      message.body.id_company = user.id_company;
    }

    return true;
  }

  /**
  * 
  */
  static async PermissionsDirections(message, role, login) {
    let permissions = await Roles.GetRole(role);
    let user = await Roles.GetUser(login);

    if(message.body.type_request == 'directions_change' && permissions.perm_admin_panel.access == '-') {
      return false;
    }
    else if(message.body.type_request == 'directions_info' && permissions.perm_directions.access == '-') {
      return false;
    }
    else if(message.body.type_request == 'directions_info' && permissions.perm_directions.access == 'limited') {
      message.body.id_direction = user.id_direction;
    }

    return true;
  }

  /**
  * 
  */
  static async PermissionsDivisions(message, role, login) {
    let permissions = await Roles.GetRole(role);
    let user = await Roles.GetUser(login);

    if(message.body.type_request == 'divisions_change' && permissions.perm_admin_panel.access == '-') {
      return false;
    }
    else if(message.body.type_request == 'divisions_info' && permissions.perm_divisions.access == '-') {
      return false;
    }
    else if(message.body.type_request == 'divisions_info' && permissions.perm_divisions.access == 'limited') {
      message.body.id_division = user.id_division;
    }

    return true;
  }

  /**
  * 
  */
  static async PermissionsPositions(message, role, login) {
    let permissions = await Roles.GetRole(role);
    let user = await Roles.GetUser(login);

    if(message.body.type_request == 'positions_change' && permissions.perm_admin_panel.access == '-') {
      return false;
    }
    else if(message.body.type_request == 'positions_info' && permissions.perm_positions.access == '-') {
      return false;
    }
    else if(message.body.type_request == 'positions_info' && permissions.perm_positions.access == 'limited') {
      message.body.id_positions = user.id_positions;
    }

    return true;
  }

  /**
  * 
  */
  static async PermissionsProfessionGroups(message, role) {
    let permissions = await Roles.GetRole(role);

    if(message.body.type_request == 'profession_groups_change' && permissions.perm_admin_panel.access == '-') {
      return false;
    }
    else if(message.body.type_request == 'profession_groups_info' && permissions.perm_profession_groups.access == '-') {
      return false;
    }
    else if(message.body.type_request == 'profession_groups_info' && permissions.perm_profession_groups.access == 'limited') {
      message.body.id_profession = permissions.perm_profession_groups.id_profession;
    }

    return true;
  }

  /**
  * 
  */
  static async PermissionsProfessions(message, role, login) {
    let permissions = await Roles.GetRole(role);
    let user = await Roles.GetUser(login);

    if(message.body.type_request == 'professions_change' && permissions.perm_admin_panel.access == '-') {
      return false;
    }
    else if(message.body.type_request == 'professions_info' && permissions.perm_professions.access == '-') {
      return false;
    }
    if(message.body.type_request == 'professions_info' && permissions.perm_professions.access == 'limited') {
      message.body.id_profession = user.id_profession;
    }

    return true;
  }

  /**
  * 
  */
  static async PermissionsSections(message, role) {
    let permissions = await Roles.GetRole(role);

    if(message.body.type_request == 'sections_change' && permissions.perm_admin_panel.access == '-') {
      return false;
    }
    else if(message.body.type_request == 'sections_info' && permissions.perm_sections.access == '-') {
      return false;
    }
    else if(message.body.type_request == 'sections_info' && permissions.perm_sections.access == 'limited') {
      message.body.id_section = permissions.perm_sections.id_section;
    }

    return true;
  }

  /**
  * 
  */
  static async PermissionsUsers(message, role, login) {
    let permissions = await Roles.GetRole(role);

    if(message.body.type_request == 'user_change' && permissions.perm_admin_panel.access != '*' && login != message.body.user.login) {
      return false;
    }
    else if(message.body.type_request == 'users_info' && permissions.perm_users.access == '-') {
      return false;
    }

    return true;
  }

  /**
  * 
  */
  static async PermissionsRoles(message, role) {
    let permissions = await Roles.GetRole(role);

    if(message.body.type_request == 'roles_change' && permissions.perm_admin_panel.access != '*') {
      return false;
    }
    else if(message.body.type_request == 'roles_info' && permissions.perm_roles.access == '-') {
      return false;
    }

    return true;
  }

  /**
  * 
  */
  static async PermissionsNotifications(message, role) {
    let permissions = await Roles.GetRole(role);

    //if(message.body.type_request == 'notifications_info' && permissions.perm_notifications.access != '*') {
      //return false;
    //}

    return true;
  }

  /**
  * 
  */
  static async PermissionsPlanSchedule(message, role) {
    let permissions = await Roles.GetRole(role);

    if(message.body.type_request == 'SAVE' && permissions.perm_plan_schedule.access != '*') {
      return false;
    }
    else if(message.body.type_request == 'VIEW' && permissions.perm_plan_schedule.access == '-') {
      return false;
    }

    return true;
  }

  /**
  * 
  */
  static async PermissionsStatement(message, role) {
    let permissions = await Roles.GetRole(role);

    if(message.body.type_request == 'SAVE_STATEMENT' && permissions.perm_statement.access != '*') {
      return false;
    }
    else if(message.body.type_request == 'VIEW_STATEMENT' && permissions.perm_statement.access == '-') {
      return false;
    }

    return true;
  }

  /**
  * 
  */
  static async GetRole(role) {
    role = (await Mysql.Request(`skos`, `SELECT * FROM Roles WHERE id=${role};`))[0];

    role.perm_admin_panel = JSON.parse(role.perm_admin_panel);
    role.perm_directions = JSON.parse(role.perm_directions);
    role.perm_companies = JSON.parse(role.perm_companies);
    role.perm_divisions = JSON.parse(role.perm_divisions);
    role.perm_positions = JSON.parse(role.perm_positions);
    role.perm_profession_groups = JSON.parse(role.perm_profession_groups);
    role.perm_professions = JSON.parse(role.perm_professions);
    role.perm_sections = JSON.parse(role.perm_sections);
    role.perm_roles = JSON.parse(role.perm_roles);
    role.perm_users = JSON.parse(role.perm_users);
    role.perm_notifications = JSON.parse(role.perm_notifications);
    role.perm_plan_schedule = JSON.parse(role.perm_plan_schedule);
    role.perm_statement = JSON.parse(role.perm_statement);

    return role;
  }

  /**
  * 
  */
  static async GetUser(login) {
    let user = (await Mysql.Request(`skos_users`, `SELECT * FROM Users WHERE login='${login}';`))[0];

    return user;
  }

  /**
  * 
  */
  static async PermissionsStrInObj(role) {
    if(typeof role.perm_admin_panel == "object")
      role.perm_admin_panel = JSON.stringify(role.perm_admin_panel);
    else role.perm_admin_panel = null;
    if(typeof role.perm_directions == "object")
      role.perm_directions = JSON.stringify(role.perm_directions);
    else role.perm_directions = null;
    if(typeof role.perm_companies == "object")
      role.perm_companies = JSON.stringify(role.perm_companies);
    else role.perm_companies = null;
    if(typeof role.perm_divisions == "object")
      role.perm_divisions = JSON.stringify(role.perm_divisions);
    else role.perm_divisions = null;
    if(typeof role.perm_positions == "object")
      role.perm_positions = JSON.stringify(role.perm_positions);
    else role.perm_positions = null;
    if(typeof role.perm_profession_groups == "object")
      role.perm_profession_groups = JSON.stringify(role.perm_profession_groups);
    else role.perm_profession_groups = null;
    if(typeof role.perm_professions == "object")
      role.perm_professions = JSON.stringify(role.perm_professions);
    else role.perm_professions = null;
    if(typeof role.perm_sections == "object")
      role.perm_sections = JSON.stringify(role.perm_sections);
    else role.perm_sections = null;
    if(typeof role.perm_roles == "object")
      role.perm_roles = JSON.stringify(role.perm_roles);
    else role.perm_roles = null;
    if(typeof role.perm_users == "object")
      role.perm_users = JSON.stringify(role.perm_users);
    else role.perm_users = null;
    if(typeof role.perm_notifications == "object")
      role.perm_notifications = JSON.stringify(role.perm_notifications);
    else role.perm_notifications = null;
    if(typeof role.perm_plan_schedule == "object")
      role.perm_plan_schedule = JSON.stringify(role.perm_plan_schedule);
    else role.perm_plan_schedule = null;
    if(typeof role.perm_statement == "object")
      role.perm_statement = JSON.stringify(role.perm_statement);
    else role.perm_statement = null;

    return role;
  }
}

//-----------Экспортируемые модули-----------//
module.exports = Roles;
//-----------Экспортируемые модули-----------//