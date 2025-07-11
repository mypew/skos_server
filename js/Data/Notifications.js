//-----------Подключаемые модули-----------//
const Mysql = require('./../DataBase/Mysql');
const Roles = require('./Roles');
const User = require('./User');
const Authorization = require('./../Server/Authorization');
const ValidationData = require('./../Server/ValidationData');
const MyDate = require('./../Modules/MyDate');
const Email = require('./../Modules/Email');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class Notifications {
  static today_date = new Date();

  /**
   * 
   */
  static async Post(message) {
    if(!(await ValidationData.NotificationsPost(message))) return {error: "Bad data"};

    let token = await Authorization.TokenInfo(message);
    if(!token.token_verify) return {error: "Bad token"};

    if(!(await Roles.PermissionsNotifications(message, token.token_info.role))) return {error: "Permission denied"};

    let data = "OK";

    if(message.body.type_request == 'notifications_info') {
      let user = await User.GetUser(token.token_info.login);
      data = []

      if(user.perm.perm_notifications.access == "-") {
        //---
      } 
      else if (user.perm.perm_notifications.access == "limitedCompany") {
        data = await Mysql.Request(`skos`,`SELECT *,${3} as status_perm FROM NotificationsCompanies WHERE id_company=${user.id_company};`);
        for(let i = 0; i < data.length; i++) {
          data[i].date_start_training = await MyDate.TableDate(data[i].date_start_training);
          data[i].date_reading = await MyDate.TableDate(data[i].date_reading);
          data[i].date_mail = await MyDate.TableDate(data[i].date_mail);
        }
      } 
      else if (user.perm.perm_notifications.access == "limitedDirection") {
        data = await Mysql.Request(`skos`,`SELECT a.*,b.type,b.id_role,${1} as status_perm FROM Notifications as a LEFT JOIN NotificationsPlan as b ON a.id_notification_plan=b.id WHERE b.type=1 AND b.id_role=${user.role} AND a.id_direction=${user.id_direction};`);
        for(let i = 0; i < data.length; i++) {
          data[i].date_start_training = await MyDate.TableDate(data[i].date_start_training);
          data[i].date_reading = await MyDate.TableDate(data[i].date_reading);
          data[i].companies = await Mysql.Request(`skos`,`SELECT * FROM NotificationsCompanies WHERE id_notification=${data[i].id};`);
        }
      } 
      else if (user.perm.perm_notifications.access == "limitedAllDirection") {
        data = await Mysql.Request(`skos`,`SELECT a.*,b.type,b.id_role,${2} as status_perm FROM Notifications as a LEFT JOIN NotificationsPlan as b ON a.id_notification_plan=b.id WHERE b.type=2 AND b.id_role=${user.role};`);
        for(let i = 0; i < data.length; i++) {
          data[i].date_start_training = await MyDate.TableDate(data[i].date_start_training);
          data[i].date_reading = await MyDate.TableDate(data[i].date_reading);
          data[i].companies = await Mysql.Request(`skos`,`SELECT * FROM NotificationsCompanies WHERE id_notification=${data[i].id};`);
        }
      } 
      else if (user.perm.perm_notifications.access == "*") {
        data = await Mysql.Request(`skos`,`SELECT a.*,b.type as status_perm,b.id_role FROM Notifications as a LEFT JOIN NotificationsPlan as b ON a.id_notification_plan=b.id;`);
        for(let i = 0; i < data.length; i++) {
          data[i].date_start_training = await MyDate.TableDate(data[i].date_start_training);
          data[i].date_reading = await MyDate.TableDate(data[i].date_reading);
          data[i].companies = await Mysql.Request(`skos`,`SELECT * FROM NotificationsCompanies WHERE id_notification=${data[i].id};`);
        }
        let companies = await Mysql.Request(`skos`,`SELECT *,${3} as status_perm FROM NotificationsCompanies;`);
        for(let i = 0; i < companies.length; i++) {
            companies[i].date_start_training = await MyDate.TableDate(companies[i].date_start_training);
            companies[i].date_reading = await MyDate.TableDate(companies[i].date_reading);
            companies[i].date_mail = await MyDate.TableDate(companies[i].date_mail);
            data.push(companies[i]);
        }
      } 
    }
    else if(message.body.type_request == 'notifications_change') {
      for(let i = 0; i < message.body.notifications.length; i++) {
        if(message.body.notifications[i].status_perm != 3) {
          await Mysql.ParameterChange(`skos`, `Notifications`, message.body.notifications[i].status, [
              {name: 'id', data: message.body.notifications[i].id, type: 'INT'},
              {name: 'status_notification', data: message.body.notifications[i].status_notification, type: 'INT'},
              {name: 'date_reading', data: message.body.notifications[i].date_reading, type: 'STRING'},
          ]);

          let notification = (await Mysql.Request(`skos`,`SELECT * FROM Notifications WHERE id=${message.body.notifications[i].id}`))[0];
          for(let j = 0; j < message.body.notifications[i].companies.length; j++) {
            if(message.body.notifications[i].companies[j].status == 2) {
              let output = await Mysql.ParameterChange(`skos`, `NotificationsCompanies`, message.body.notifications[i].companies[j].status, [
                {name: 'id', data: message.body.notifications[i].companies[j].id, type: 'INT'},
                {name: 'id_notification', data: notification.id, type: 'INT'},
                {name: 'id_company', data: message.body.notifications[i].companies[j].id_company, type: 'INT'},
                {name: 'count_people', data: message.body.notifications[i].companies[j].count_people, type: 'INT'},
                {name: 'telegram', data: message.body.notifications[i].companies[j].telegram, type: 'STRING'},
                {name: 'writ', data: message.body.notifications[i].companies[j].writ, type: 'STRING'},
                {name: 'id_training', data: notification.id_training, type: 'INT'},
                {name: 'id_direction', data: notification.id_direction, type: 'INT'},
                {name: 'id_division', data: notification.id_division, type: 'INT'},
                {name: 'id_section', data: notification.id_section, type: 'INT'},
                {name: 'id_profession', data: notification.id_profession, type: 'INT'},
                {name: 'id_DL', data: notification.id_DL, type: 'INT'},
                {name: 'date_mail', data: (await MyDate.DateMysqlTimeStamp(new Date())), type: 'STRING'},
                {name: 'status_notification', data: 0, type: 'INT'},
                {name: 'date_start_training', data: (await MyDate.DateMysqlTimeStamp(notification.date_start_training)), type: 'STRING'},
                {name: 'date_reading', data: null, type: 'STRING'},
                {name: 'count_people_fact', data: null, type: 'INT'}
              ]);

              await Notifications.SendNotificationMail(output.insertId, 3);
            }
            else {
              await Mysql.ParameterChange(`skos`, `NotificationsCompanies`, message.body.notifications[i].companies[j].status, [
                {name: 'id', data: message.body.notifications[i].companies[j].id, type: 'INT'},
                {name: 'id_notification', data: notification.id, type: 'INT'},
                {name: 'id_company', data: message.body.notifications[i].companies[j].id_company, type: 'INT'},
                {name: 'count_people', data: message.body.notifications[i].companies[j].count_people, type: 'INT'},
                {name: 'telegram', data: message.body.notifications[i].companies[j].telegram, type: 'STRING'},
                {name: 'writ', data: message.body.notifications[i].companies[j].writ, type: 'STRING'}
              ]);
            }
          } 
        }
        else if (message.body.notifications[i].status_perm == 3) {
          await Mysql.ParameterChange(`skos`, `NotificationsCompanies`, message.body.notifications[i].status, [
            {name: 'id', data: message.body.notifications[i].id, type: 'INT'},
            {name: 'status_notification', data: message.body.notifications[i].status_notification, type: 'INT'},
            {name: 'date_reading', data: message.body.notifications[i].date_reading, type: 'STRING'},
            {name: 'writ', data: message.body.notifications[i].writ, type: 'INT'},
            {name: 'count_people_fact', data: message.body.notifications[i].count_people_fact, type: 'INT'}
          ]);
        }
      }
    }
    else if(message.body.type_request == 'notifications_plan_info') {
      data = await Mysql.Request(`skos`,`SELECT * FROM NotificationsPlan;`);
    }
    else if(message.body.type_request == 'notifications_plan_change') {
      for(let i = 0; i < message.body.notifications_plan.length; i++) {
        await Mysql.ParameterChange(`skos`, `NotificationsPlan`, message.body.notifications_plan[i].status, [
            {name: 'id', data: message.body.notifications_plan[i].id, type: 'INT'},
            {name: 'days', data: message.body.notifications_plan[i].days, type: 'INT'},
            {name: 'count_notifications', data: message.body.notifications_plan[i].count_notifications, type: 'INT'},
            {name: 'type', data: message.body.notifications_plan[i].type, type: 'INT'},
            {name: 'id_role', data: message.body.notifications_plan[i].id_role, type: 'INT'},
        ]);
      }
    }

    return data;
  }

  /**
   * 
   */
  static async SendNotificationMail(id_notification, status_perm) {
    let notification;
    if(status_perm >= 1 && status_perm <= 2)
      notification = (await Mysql.Request(`skos`,`SELECT a.*,b.id_role,b.days FROM Notifications as a LEFT JOIN NotificationsPlan as b ON a.id_notification_plan=b.id WHERE a.id=${id_notification};`))[0];
    else if(status_perm == 3) 
      notification = (await Mysql.Request(`skos`,`SELECT * FROM NotificationsCompanies WHERE id=${id_notification};`))[0];

    let user;
    if(status_perm == 1)
      user = await Mysql.Request(`skos_users`,`SELECT * FROM Users WHERE role=${notification.id_role} and id_direction=${notification.id_direction};`);
    else if(status_perm == 2)
      user = await Mysql.Request(`skos_users`,`SELECT * FROM Users WHERE role=${notification.id_role};`);
    else if(status_perm == 3)
      user = await Mysql.Request(`skos_users`,`SELECT * FROM Users WHERE id_company=${notification.id_company};`);

    for(let i = 0; i < user.length; i++) {
      let title = `Пришло уведомление`;
      let message =  `Уважаемый ${user[i].surname} ${user[i].name}, система контроля обучения сотрудников сообщает, что вам пришло уведомление, ознакомьтесь.`;

      Email.SendMail(user[i].email, title, message);
    }
  }

  /**
   * 
   */
  static async RecostingNotifications() {
    /** Проверяем, наступил ли следующий день, если да, то делаем расчёт уведомлений */
    if((await MyDate.getDiffDay(Notifications.today_date)) != 0) {
      let start = new Date().getTime();
      console.log(`Таймер RecostingNotifications делает расчёт...`);
      //-------------------------------------------------------//

    
      console.log(`RecostingNotifications запустил ежедневный расчёт уведомлений...`);

      let directions = await Mysql.Request(`skos`,`SELECT * FROM DirectionList;`);
      let notifications_plan = await Mysql.Request(`skos`,`SELECT * FROM NotificationsPlan ORDER BY days;`);

      for(let i = 0; i < directions.length; i++) {
        for(let j = 0; j < notifications_plan.length; j++) {
          // Проверка, если от дирекции не приехали все студенты и если дата старта учебы входит в диапазон плана уведомлений
          // то создаем уведомление
          if(directions[i].date_start_training != null && 
            directions[i].count_people > directions[i].count_people_fact &&
            (await MyDate.getDiffDay(directions[i].date_start_training)) == notifications_plan[j].days) {

            let train = (await Mysql.Request(`skos`,`SELECT * FROM TrainingList WHERE id=${directions[i].id_training};`))[0];
            
            let output = await Mysql.ParameterChange(`skos`, `Notifications`, 2, [
              {name: 'id', data: null, type: 'INT'},
              {name: 'id_training', data: directions[i].id_training, type: 'INT'},
              {name: 'id_direction', data: directions[i].id_direction, type: 'INT'},
              {name: 'id_division', data: train.id_division, type: 'INT'},
              {name: 'id_section', data: train.id_section, type: 'INT'},
              {name: 'id_profession', data: train.id_profession, type: 'INT'},
              {name: 'id_DL', data: directions[i].id, type: 'INT'},
              {name: 'id_notification_plan', data: notifications_plan[j].id, type: 'INT'},
              {name: 'date_mail', data: (await MyDate.DateMysqlTimeStamp(new Date())), type: 'STRING'},
              {name: 'status_notification', data: 0, type: 'INT'},
              {name: 'count_people', data: directions[i].count_people, type: 'INT'},
              {name: 'count_people_fact', data: directions[i].count_people_fact, type: 'INT'},
              {name: 'date_start_training', data: (await MyDate.DateMysqlTimeStamp(directions[i].date_start_training)), type: 'STRING'}
            ]);
            
            await Notifications.SendNotificationMail(output.insertId, notifications_plan[j].type);
          }
        }
      }

      Notifications.today_date = new Date();

      //-------------------------------------------------------//

      let finish = new Date().getTime();
      console.log(`Таймер RecostingNotifications сделал расчёт за {${(finish - start) / 1000}} сек.`);
    }

    setTimeout(Notifications.RecostingNotifications,1000*60*3);
  }
}

//-----------Экспортируемые модули-----------//
module.exports = Notifications;
//-----------Экспортируемые модули-----------//