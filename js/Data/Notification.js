//-----------Подключаемые модули-----------//
const Mysql = require('./Mysql');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class Notification {
  /**
   * 
   */
  static async Post(message) {
    // Формируем список уведомлений
    /*let notifications = [];
    
    let training_list = await Mysql.Request(`skos`, "SELECT id,id_division,id_profession FROM TrainingList;");
    for(let i = 0; i < training_list.length; i++) {
      let profession_groups_list = await Mysql.Request(`skos`, `SELECT id,id_PG,date_start_training FROM ProfessionGroupList WHERE id_training=${training_list[i].id};`);
      for(let j = 0; j < profession_groups_list.length; j++) {
        let direction_list = await Mysql.Request(`skos`, `SELECT id,id_direction,count_people,count_people_fact,status_notification,date_reading FROM DirectionList WHERE id_PGL=${profession_groups_list[j].id} AND status_notification>0;`);
        for(let t = 0; t < direction_list.length; t++) {
          notifications.push({
            id: direction_list[t].id,
            id_direction: direction_list[t].id_direction,
            id_division: training_list[i].id_division,
            id_profession: training_list[i].id_profession,
            id_PG: profession_groups_list[j].id_PG,
            status_notification: direction_list[t].status_notification,
            date_start_training: profession_groups_list[j].date_start_training,
            date_reading: direction_list[j].date_reading
          });
        }
      }
    }*/
    // Формируем список уведомлений

    return notifications;
  }

  /**
   * 
   */
  static async RecostingNotifications() {
    let start = new Date().getTime();
    console.log(`Таймер RecostingNotifications делает расчёт...`);
    //-------------------------------------------------------//
    //Проверяем все шифры групп и их дирекции
    /*let training_list = await Mysql.Request(`skos`, "SELECT id,id_division,id_profession FROM TrainingList;");
    for(let i = 0; i < training_list.length; i++) {
      let profession_groups_list = await Mysql.Request(`skos`, `SELECT id,id_PG,date_start_training FROM ProfessionGroupList WHERE id_training=${training_list[i].id};`);
      for(let j = 0; j < profession_groups_list.length; j++) {
        if(profession_groups_list[j].date_start_training != null) {
          let difference_date = (new Date(profession_groups_list[j].date_start_training).getTime()-new Date().getTime());
          let direction_list = await Mysql.Request(`skos`, `SELECT id,id_direction,count_people,count_people_fact,status_notification,date_reading FROM DirectionList WHERE id_PGL=${profession_groups_list[j].id} AND status_notification>0;`);
          for(let t = 0; t < direction_list.length; t++) {
            if (direction_list[t].status_notification === 0 && 
                difference_date < 10*24*60*60*1000 &&
                direction_list[t].count_people > direction_list[t].count_people_fact) {
              await Mysql.Request(`skos`, `UPDATE DirectionList SET status_notification=1 WHERE id=${direction_list[t].id}`);
            } 
          }
        }
      }
    }*/
    //Проверяем все шифры групп и их дирекции
    //-------------------------------------------------------//
    let finish = new Date().getTime();
    console.log(`Таймер RecostingNotifications сделал расчёт за {${(finish - start) / 1000}} сек.`);

    setTimeout(Notification.RecostingNotifications,60000);
  }
}

//-----------Экспортируемые модули-----------//
module.exports = Notification;
//-----------Экспортируемые модули-----------//