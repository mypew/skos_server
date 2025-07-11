//-----------Подключаемые модули-----------//
//-----------Подключаемые модули-----------//

/**
 * Класс для обработки дат
 */
class MyDate {
  // Сколько часов + от UTC
  static timezone_offset = 8

  /**
    * Переводит дату js в дату Timestamp для mysql
    */
  static async DateMysqlTimeStamp(date) {
    let result;

    result = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`

    return result;
  }

  /**
    * Переводит дату js в вид даты для таблиц сайта
    */
  static async TableDate(date) {
    let date_ = new Date(date);
    let result;

    if(date_.getFullYear() == 1970) result = "";
    else result = `${date_.getFullYear()}-${String(date_.getMonth()+1).padStart(2,'0')}-${String(date_.getDate()).padStart(2,'0')}`

    return result;
  }

  /**
   * Возвращают разницу в днях = дата указанная - дата сегодняшнего дня
   */
  static async getDiffDay(date) {
    let date_ = new Date(date);
    let date_today = new Date();

    date_.setMinutes(date_.getMinutes() + MyDate.timezone_offset*60 + date_.getTimezoneOffset());
    date_ = new Date(`${date_.getFullYear()}-${date_.getMonth()+1}-${date_.getDate()}`);

    date_today.setMinutes(date_today.getMinutes() + MyDate.timezone_offset*60 + date_today.getTimezoneOffset());
    date_today = new Date(`${date_today.getFullYear()}-${date_today.getMonth()+1}-${date_today.getDate()}`);

    return Math.round((date_.getTime()-date_today.getTime())/1000/60/60/24);
  }
}

//-----------Экспортируемые модули-----------//
module.exports = MyDate;
//-----------Экспортируемые модули-----------//