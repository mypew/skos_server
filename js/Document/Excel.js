//-----------Подключаемые модули-----------//
const Mysql = require('./../DataBase/Mysql');
const Roles = require('./../Data/Roles');
const Authorization = require('./../Server/Authorization');
const ValidationData = require('./../Server/ValidationData');
const MyDate = require('./../Modules/MyDate');
const Aspose = require("aspose.cells.java");
const AdmZip = require("adm-zip");
//-----------Подключаемые модули-----------//

/**
 * Класс для работы с Docx документами
 */
class Excel {

  static path_save = '/var/www/SKOS/excel/';

  /**
   * 
   */
  static async Post(message) {
    if(!(await ValidationData.ExcelPost(message))) return {error: "Bad data"};

    let token = await Authorization.TokenInfo(message);
    if(!token.token_verify) return {error: "Bad token"};

    let data = "OK";

    if(message.body.type_request == "generate") {
      data = await Excel.Generate(message);
    } 
    else if(message.body.type_request == "data") {
      data = await Excel.Data(message);
    }
    else {
      data = "Bad type";
    }

    return data;
  }

  /**
   * 
   */
  static async Generate(message) {
    let key;
    let excel = new Aspose.Workbook(Aspose.FileFormatType.XLSX);

    /** Проверка на форму документа */
    if (message.body.form == 'report') {
      key = `${message.body.form}_${new Date().getTime()}`;
      await Excel.GenerateReport(message, excel);
    } else {
      return "Bad form document";
    }

    excel.save(Excel.path_save + `${key}.xlsx`);
    await Excel.DeleteCopyright(key);
    
    return key;
  }

  /**
   * 
   */
  static async Data(message) {
    let data;

    /** Проверка на вид данных */
    if (message.body.form == 'report') {
      data = await Excel.DataReport(message);
    } else {
      return "Bad form data";
    }
    
    return data;
  }

  static async DataReport(message) {
    /** Переменные для фильтрации данных, если такое указано */
    let from_date = (typeof message.body.from_date != "undefined") ? await MyDate.DateMysqlTimeStamp(message.body.from_date) : `1970-01-01`;
    let to_date = (typeof message.body.to_date != "undefined") ? await MyDate.DateMysqlTimeStamp(message.body.to_date) : `2100-01-01`;

    /** Получение необходимых данных */
    let training_list = await Mysql.Request(`skos`, `SELECT * FROM TrainingList as a RIGHT JOIN DirectionList as b ON a.id = b.id_training WHERE b.date_start_training BETWEEN '${from_date}' AND '${to_date}';`);
    let directions = await Mysql.Request(`skos`, `SELECT * FROM Directions`);
    let sections = await Mysql.Request(`skos`, `SELECT * FROM Sections`);
    let divisions = await Mysql.Request(`skos`, `SELECT * FROM Divisions`);
    let directions_name = new Map();
    let sections_name = new Map();
    let divisions_name = new Map();
    let list = new Map();
    let list_filter = new Map();
    /** Получение необходимых данных */

    /** Преобразование данных */
    // Добавление параметра Итого для результатов
    directions.push({id: -1, name: 'Итого'});
    divisions.push({id: -1, name: 'Итого'});
    sections.push({id: -1, name: 'Итого'});

    // Формирование словаря с размерностью 4(name секции, name подразделения, name дирекции, (план,факт))
    for(let i = 0; i < sections.length; i++) {
      list.set(sections[i].name, new Map());
      for(let j = 0; j < divisions.length; j++) {
        list.get(sections[i].name).set(divisions[j].name, new Map());
        for(let k = 0; k < directions.length; k++) {
          list.get(sections[i].name).get(divisions[j].name).set(directions[k].name, new Map());
          list.get(sections[i].name).get(divisions[j].name).get(directions[k].name).set('план', 0);
          list.get(sections[i].name).get(divisions[j].name).get(directions[k].name).set('факт', 0);
        }
      }
    }

    // Формирование и заполнение данными словаря с размерностью 1(id дирекции)
    for(let i = 0; i < directions.length; i++) {
      directions_name.set(directions[i].id, directions[i].name);
    }

    // Формирование и заполнение данными словаря с размерностью 1(id секции)
    for(let i = 0; i < sections.length; i++) {
      sections_name.set(sections[i].id, sections[i].name);
    }

    // Формирование и заполнение данными словаря с размерностью 1(id подразделения)
    for(let i = 0; i < divisions.length; i++) {
      divisions_name.set(divisions[i].id, divisions[i].name);
    }
    
    // Заполнение словаря данными
    for(let i = 0; i < training_list.length; i++) {
      let param_one = [sections_name.get(training_list[i].id_section), 'Итого'];
      let param_two = [divisions_name.get(training_list[i].id_division), 'Итого'];
      let param_three = [directions_name.get(training_list[i].id_direction), 'Итого'];

      for(let p1 = 0; p1 < param_one.length; p1++) {
        for(let p2 = 0; p2 < param_two.length; p2++) {
          for(let p3 = 0; p3 < param_three.length; p3++) {
            let plan_fact = list.get(param_one[p1]).get(param_two[p2]).get(param_three[p3]);
            plan_fact.set('план', plan_fact.get('план') + training_list[i].count_people);
            plan_fact.set('факт', plan_fact.get('факт') + training_list[i].count_people_fact);
          }
        }
      }
    }
    /** Преобразование данных */

    /** Перевод list из Map в удобный вид для передачи в json */
    let data = {};

    for(let section of sections) {
      // Условие, в результате которого мы отбрасываем все секции, которые не участвует в план-графике
      if(list.get(section.name).get('Итого').get('Итого').get('план') != 0) {
        data[section.name] = {};
        for(let division of divisions) {
          // Условие, в результате которого мы отбрасываем все подразделения, которые не участвует в секции
          if(list.get(section.name).get(division.name).get('Итого').get('план') != 0) {
            data[section.name][division.name] = {};
            for(let direction of directions) {
              // Условие, в результате которого мы отбрасываем все дирекции, которые не участвует в план-графике
              if(list.get('Итого').get('Итого').get(direction.name).get('план') != 0 || direction.name == 'Итого') {
                data[section.name][division.name][direction.name] = {};
                data[section.name][division.name][direction.name]['план'] = list.get(section.name).get(division.name).get(direction.name).get('план');
                data[section.name][division.name][direction.name]['факт'] = list.get(section.name).get(division.name).get(direction.name).get('факт');
              }
            }
          }
        }
      }
    }

    /** Перевод list из Map в удобный вид для передачи в json */

    return {data: data, directions: directions, sections: sections, divisions: divisions};
  }

  /**
   * 
   */
  static async GenerateReport(message, excel) {
    /** Переменные для фильтрации данных, если такое указано */
    let from_date = (typeof message.body.from_date != "undefined") ? await MyDate.DateMysqlTimeStamp(message.body.from_date) : `1970-01-01`;
    let to_date = (typeof message.body.to_date != "undefined") ? await MyDate.DateMysqlTimeStamp(message.body.to_date) : `2100-01-01`;

    /** Получение необходимых данных */
    let training_list = await Mysql.Request(`skos`, `SELECT * FROM TrainingList as a RIGHT JOIN DirectionList as b ON a.id = b.id_training WHERE b.date_start_training BETWEEN '${from_date}' AND '${to_date}';`);
    let directions = await Mysql.Request(`skos`, `SELECT * FROM Directions`);
    let sections = await Mysql.Request(`skos`, `SELECT * FROM Sections`);
    let divisions = await Mysql.Request(`skos`, `SELECT * FROM Divisions`);
    let directions_name = new Map();
    let sections_name = new Map();
    let divisions_name = new Map();
    let list = new Map();
    /** Получение необходимых данных */

    /** Преобразование данных */
    // Добавление параметра Итого для результатов
    directions.push({id: -1, name: 'Итого'});
    divisions.push({id: -1, name: 'Итого'});
    sections.push({id: -1, name: 'Итого'});

    // Формирование словаря с размерностью 4(name секции, name подразделения, name дирекции, (план,факт))
    for(let i = 0; i < sections.length; i++) {
      list.set(sections[i].name, new Map());
      for(let j = 0; j < divisions.length; j++) {
        list.get(sections[i].name).set(divisions[j].name, new Map());
        for(let k = 0; k < directions.length; k++) {
          list.get(sections[i].name).get(divisions[j].name).set(directions[k].name, new Map());
          list.get(sections[i].name).get(divisions[j].name).get(directions[k].name).set('план', 0);
          list.get(sections[i].name).get(divisions[j].name).get(directions[k].name).set('факт', 0);
        }
      }
    }

    // Формирование и заполнение данными словаря с размерностью 1(id дирекции)
    for(let i = 0; i < directions.length; i++) {
      directions_name.set(directions[i].id, directions[i].name);
    }

    // Формирование и заполнение данными словаря с размерностью 1(id секции)
    for(let i = 0; i < sections.length; i++) {
      sections_name.set(sections[i].id, sections[i].name);
    }

    // Формирование и заполнение данными словаря с размерностью 1(id подразделения)
    for(let i = 0; i < divisions.length; i++) {
      divisions_name.set(divisions[i].id, divisions[i].name);
    }
    
    // Заполнение словаря данными
    for(let i = 0; i < training_list.length; i++) {
      let param_one = [sections_name.get(training_list[i].id_section), 'Итого'];
      let param_two = [divisions_name.get(training_list[i].id_division), 'Итого'];
      let param_three = [directions_name.get(training_list[i].id_direction), 'Итого'];

      for(let p1 = 0; p1 < param_one.length; p1++) {
        for(let p2 = 0; p2 < param_two.length; p2++) {
          for(let p3 = 0; p3 < param_three.length; p3++) {
            let plan_fact = list.get(param_one[p1]).get(param_two[p2]).get(param_three[p3]);
            plan_fact.set('план', plan_fact.get('план') + training_list[i].count_people);
            plan_fact.set('факт', plan_fact.get('факт') + training_list[i].count_people_fact);
          }
        }
      }
    }
    /** Преобразование данных */

    /** Вставка данных в excel страницу */
    let cells = excel.getWorksheets().get(0).getCells();
    let base_x = 0;
    let base_y = 0;
    let x;
    let y;
    let count_true_directions = 0;
    let count_true_sections = 0;
    let count_true_divisions = 0;
    let style = await Excel.GetReportStyle();
    let style_gray = await Excel.GetReportGrayStyle();
    let style_bad_cell = await Excel.GetReportBadCellStyle();

    // Задаём базовый стиль всем ячейкам
    cells.setStandardHeight(24);
    cells.setStandardWidth(4);
    cells.setStyle(style);

    // Вставляем имена дирекций, (план,факт), секций, подразделений и итогов
    x = base_x + 3;
    y = base_y + 3;
    for(let direction of directions) {
      // Условие, в результате которого мы отбрасываем все дирекции, которые не участвует в план-графике
      if(list.get('Итого').get('Итого').get(direction.name).get('план') != 0 || direction.name == 'Итого') {
        cells.get(x, y).putValue(direction.name);
        (count_true_directions % 2 == 0) ? cells.get(x, y).setStyle(style_gray) : false;
        await Excel.Merge(cells, x, y, 1, 2);

        cells.get(x+1, y).putValue('план');
        (count_true_directions % 2 == 0) ? cells.get(x+1, y).setStyle(style_gray) : false;

        cells.get(x+1, y+1).putValue('факт');
        (count_true_directions % 2 == 0) ? cells.get(x+1, y+1).setStyle(style_gray) : false;

        count_true_directions++;
        y += 2;
      }
    }

    x = base_x + 5;
    y = base_y + 3;
    for(let section of sections) {
      if(section.name != 'Итого') {
        // Условие, в результате которого мы отбрасываем все секции, которые не участвует в план-графике
        if(list.get(section.name).get('Итого').get('Итого').get('план') != 0) {
          cells.get(x, y).putValue(section.name);
          await Excel.Merge(cells, x, y-3, 1, 3);
          await Excel.Merge(cells, x, y, 1, (count_true_directions-1)*2);
          await Excel.Merge(cells, x, y+(count_true_directions-1)*2, 1, 2);
          await Excel.SetBold(cells.get(x, y), true);

          y = base_y;
          for(let division of divisions) {
            // Условие, в результате которого мы отбрасываем все подразделения, которые не участвует в секции
            if(list.get(section.name).get(division.name).get('Итого').get('план') != 0) {
              x++;
              cells.get(x, y).putValue(division.name);
              await Excel.Merge(cells, x, y, 1, 3);
              (division.name == 'Итого') ? await Excel.SetBorder(cells, x, y, 1, 3) : false;
              (division.name == 'Итого') ? await Excel.SetBold(cells.get(x, y), true) : false;
              count_true_divisions++;
            }
          }

          count_true_sections++;
          x++;
          y = base_y + 3;
        }
      } else {
        y = base_y;
        cells.get(x, y).putValue('Итого (Для всех секций)');
        await Excel.Merge(cells, x, y, 1, 3);
        await Excel.SetBorder(cells, x, y, 1, 3);
        await Excel.SetBold(cells.get(x, y), true);
        count_true_divisions++;
      }
    }

    // Оформляем документ
    cells.get(base_x, base_y).putValue(`Справка по выполнению плана-графика c ${from_date} по ${to_date}`);
    await Excel.Merge(cells, base_x, base_y, 2, count_true_directions*2+3);
    await Excel.SetBorder(cells, base_x, base_y, 2, count_true_directions*2+3);
    await Excel.SetBold(cells.get(base_x, base_y), true);

    cells.get(base_x+2, base_y+3).putValue(`Выполнение плана по региональным дирекциям и РЦКУ, чел.`);
    count_true_directions>1 ? await Excel.Merge(cells, base_x+2, base_y+3, 1, (count_true_directions-1)*2) : false;
    await Excel.Merge(cells, base_x+2, base_y+3+(count_true_directions-1)*2, 1, 2);

    cells.get(base_x+2, base_y).putValue(`Наименование подразделений`);
    await Excel.Merge(cells, base_x+2, base_y, 3, 3);

    await Excel.SetBorder(cells, base_x+2, base_y, 3+count_true_sections+count_true_divisions, 3);
    count_true_directions>1 ? await Excel.SetBorder(cells, base_x+2, base_y+3, 3+count_true_sections+count_true_divisions, (count_true_directions-1)*2) : false;
    await Excel.SetBorder(cells, base_x+2, base_y+3+(count_true_directions-1)*2, 3+count_true_sections+count_true_divisions, 2);

    // Вставляем данные
    x = base_x + 6;
    y = base_y + 3;
    let count = 0;
    for(let section of list.keys()) {
      if(section != 'Итого') {
        // Условие, в результате которого мы отбрасываем все секции, которые не участвует в план-графике
        if(list.get(section).get('Итого').get('Итого').get('план') != 0) {
          for(let division of list.get(section).keys()) {
            // Условие, в результате которого мы отбрасываем все подразделения, которые не участвует в секции
            if(list.get(section).get(division).get('Итого').get('план') != 0) {
              for(let direction of list.get(section).get(division).keys()) {
                // Условие, в результате которого мы отбрасываем все дирекции, которые не участвует в план-графике
                if(list.get('Итого').get('Итого').get(direction).get('план') != 0) {
                  if(list.get(section).get(division).get(direction).get('план') != 0) {
                    cells.get(x, y).putValue(list.get(section).get(division).get(direction).get('план'));
                    cells.get(x, y+1).putValue(list.get(section).get(division).get(direction).get('факт'));
                  }
                  else {
                    cells.get(x, y).putValue('-');
                    cells.get(x, y+1).putValue('-');
                  }
                  if(list.get(section).get(division).get(direction).get('план') > list.get(section).get(division).get(direction).get('факт')) {
                    cells.get(x, y+1).setStyle(style_bad_cell);
                  } else {
                    (count % 2 == 0) ? cells.get(x, y+1).setStyle(style_gray) : false;
                  }
                  (count % 2 == 0) ? cells.get(x, y).setStyle(style_gray) : false;
                  (division == 'Итого' || direction == 'Итого') ? await Excel.SetBorder(cells, x, y, 1, 1) : false;
                  (division == 'Итого' || direction == 'Итого') ? await Excel.SetBorder(cells, x, y+1, 1, 1) : false;
                  await Excel.SetBold(cells.get(x, y), true);
                  await Excel.SetBold(cells.get(x, y+1), true);
                  y += 2;
                  count++;
                }
              }
              x++;
              y = base_y + 3;
              count = 0;
            }
          }
          x++;
          y = base_y + 3;
        }
      }
      else {
        x--;
        for(let direction of list.get(section).get('Итого').keys()) {
          // Условие, в результате которого мы отбрасываем все дирекции, которые не участвует в план-графике
          if(list.get('Итого').get('Итого').get(direction).get('план') != 0) {
            cells.get(x, y).putValue(list.get(section).get('Итого').get(direction).get('план'));
            cells.get(x, y+1).putValue(list.get(section).get('Итого').get(direction).get('факт'));
            if(list.get(section).get('Итого').get(direction).get('план') > list.get(section).get('Итого').get(direction).get('факт')) {
              cells.get(x, y+1).setStyle(style_bad_cell);
            } else {
              (count % 2 == 0) ? cells.get(x, y+1).setStyle(style_gray) : false;
            }
            (count % 2 == 0) ? cells.get(x, y).setStyle(style_gray) : false;
            await Excel.SetBorder(cells, x, y, 1, 1);
            await Excel.SetBorder(cells, x, y+1, 1, 1);
            await Excel.SetBold(cells.get(x, y), true);
            await Excel.SetBold(cells.get(x, y+1), true);
            count++;
            y += 2;
          }
        }
        count = 0;
      }
    }
    /** Вставка данных в excel страницу */
  }

  /**
   * 
   */
  static async GetBaseStyle() {
    return (new Aspose.Workbook(Aspose.FileFormatType.XLSX)).getWorksheets().get(0).getCells().getStyle();
  }

  /**
   * 
   */
  static async GetReportStyle() {
    let style = await Excel.GetBaseStyle();
    style.getFont().setName('Times New Roman');
    style.getFont().setColor(Aspose.Color.getBlack());
    style.getFont().setSize(10);
    style.setPattern(Aspose.BackgroundType.SOLID);
    style.setForegroundColor(Aspose.Color.fromArgb(255, 255, 255));
    style.setBorder(Aspose.BorderType.BOTTOM_BORDER,Aspose.CellBorderType.THIN, Aspose.Color.getBlack());
    style.setBorder(Aspose.BorderType.LEFT_BORDER,Aspose.CellBorderType.THIN, Aspose.Color.getBlack());
    style.setBorder(Aspose.BorderType.RIGHT_BORDER,Aspose.CellBorderType.THIN, Aspose.Color.getBlack());
    style.setBorder(Aspose.BorderType.TOP_BORDER,Aspose.CellBorderType.THIN, Aspose.Color.getBlack());
    style.setTextWrapped(true); // Переносить текст
    style.setHorizontalAlignment(Aspose.TextAlignmentType.CENTER);
    style.setVerticalAlignment(Aspose.TextAlignmentType.CENTER);

    return style;
  }

  /**
   * 
   */
  static async GetReportGrayStyle() {
    let style = await Excel.GetReportStyle();
    style.setForegroundColor(Aspose.Color.fromArgb(235, 235, 235));

    return style;
  }

  /**
   * 
   */
  static async GetReportBadCellStyle() {
    let style = await Excel.GetReportStyle();
    style.getFont().setColor(Aspose.Color.fromArgb(173, 0, 6)); 
    style.setForegroundColor(Aspose.Color.fromArgb(255, 199, 206));

    return style;
  }

  /**
   * 
   */
  static async SetBorder(cells, x, y, size_x, size_y) {
    cells.createRange(x, y, size_x, size_y).setOutlineBorders(Aspose.CellBorderType.MEDIUM, Aspose.Color.getBlack());
  }

  /**
   * 
   */
  static async Merge(cells, x, y, size_x, size_y) {
    cells.createRange(x, y, size_x, size_y).merge();
  }

  /**
   * 
   */
  static async SetBold(cell, is) {
    let style = cell.getStyle();
    style.getFont().setBold(is);
    cell.setStyle(style);
  }

  /**
   * 
   */
  static async DeleteCopyright(key) {
    const replaceChar = (str, index, char) => str.substring(0, index) + char + str.substring(index + 1);
    let excel = new AdmZip(Excel.path_save + `${key}.xlsx`);
    excel.forEach(function (excelEach) {
      if (excelEach.entryName == "docProps/app.xml") {
        excel.app = excelEach.getData().toString();

        excel.app = replaceChar(excel.app, excel.app.indexOf('<vt:i4>')+7, '1');
        excel.app = replaceChar(excel.app, excel.app.indexOf('baseType="lpstr"')-3, '1');
        excel.app = excel.app.replace('<vt:lpstr>Evaluation Warning</vt:lpstr>', '');
        excel.app = excel.app.replace('Sheet1', key);

        excel.updateFile(excelEach.entryName, excel.app);
        
      }
      else if (excelEach.entryName == "xl/_rels/workbook.xml.rels") {
        excel.app = excelEach.getData().toString();

        excel.app = excel.app.replace('<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml" />', '');
        excel.app = excel.app.replace('rId5', 'rId4');

        excel.updateFile(excelEach.entryName, excel.app);
      }
      else if (excelEach.entryName == "xl/worksheets/sheet2.xml") {
        excel.deleteFile(excelEach.entryName);
      }
      else if (excelEach.entryName == "xl/sharedStrings.xml") {
        excel.app = excelEach.getData().toString();

        excel.app = excel.app.replace('<si><t>Evaluation Only. Created with Aspose.Cells for Node.js via Java. Copyright 2003 - 2024 Aspose Pty Ltd.</t></si>', '');

        excel.updateFile(excelEach.entryName, excel.app);
      }
      else if (excelEach.entryName == "xl/workbook.xml") {
        excel.app = excelEach.getData().toString();

        excel.app = excel.app.replace('Sheet1', key);
        excel.app = excel.app.replace('<sheet name="Evaluation Warning" sheetId="2" r:id="rId4" />', '');

        excel.updateFile(excelEach.entryName, excel.app);
      }
      else if (excelEach.entryName == "[Content_Types].xml") {
        excel.app = excelEach.getData().toString();

        excel.app = excel.app.replace('<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />', '');

        excel.updateFile(excelEach.entryName, excel.app);
      }
    });
    excel.writeZip(Excel.path_save + `${key}.xlsx`);
  }
}

//-----------Экспортируемые модули-----------//
module.exports = Excel;
//-----------Экспортируемые модули-----------//

//cells.setRowHeight(0, 24); // Изменить высоту строки 1 на длину 24
//cells.setColumnWidth(0, 4); // Изменить длину столбца 1 на длину 4