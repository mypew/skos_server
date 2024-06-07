//-----------Подключаемые модули-----------//
const Mysql = require('./Mysql');
const ValidationData = require('./../SubModules/ValidationData');
//-----------Подключаемые модули-----------//

/**
 * 
 */
class Table {

  /**
   * 
    */
  static async Post(message) {
    if(!(await ValidationData.TablePost(message))) return {error: "Bad request"};

    let data;

    if(message.body.request_type == "VIEW") {
      data = await Table.RequestTrainingList(message,"*","id,id_PG","id,id_direction,count_people,date_start_training,date_start_industrial_training,date_end_industrial_training,date_exam");

      //Подгонка данных под стандарты таблицы на сайте
      data = await Table.CustomizeData(data, message);
      //Подгонка данных под стандарты таблицы на сайте
    }
    else if(message.body.request_type == "VIEW_STATEMENT") {
      data = await Table.RequestTrainingList(message,"id,id_profession,id_division,id_section","id,id_PG","id,id_direction,count_people,count_people_fact,count_people_trained");
    }
    else if(message.body.request_type == "SAVE") {
      for(let i = 0; i < message.body.training_list.length; i++) {
        if(message.body.training_list[i].status == 0) {
          await Mysql.Request(`skos`, `DELETE FROM TrainingList WHERE id=${message.body.training_list[i].id};`);
        } else if(message.body.training_list[i].status == 1) {
          await Mysql.Request(`skos`, `UPDATE TrainingList SET id_division=${message.body.training_list[i].id_division},id_section=${message.body.training_list[i].id_section},id_profession=${message.body.training_list[i].id_profession},table_type=${message.body.training_list[i].table_type},academic_year=${message.body.training_list[i].academic_year},to1=${message.body.training_list[i].to1},per=${message.body.training_list[i].per},indt=${message.body.training_list[i].indt},tren=${message.body.training_list[i].tren},exam=${message.body.training_list[i].exam},to2=${message.body.training_list[i].to2},po=${message.body.training_list[i].po} WHERE id=${message.body.training_list[i].id};`);
          for(let j = 0; j < message.body.training_list[i].profession_groups.length; j++) {
            if(message.body.training_list[i].profession_groups[j].status == 0)
              await Mysql.Request(`skos`, `DELETE FROM ProfessionGroupList WHERE id=${message.body.training_list[i].profession_groups[j].id};`);
            else if(message.body.training_list[i].profession_groups[j].status == 1)
              await Mysql.Request(`skos`, `UPDATE ProfessionGroupList SET id_PG=${message.body.training_list[i].profession_groups[j].id_PG},id_training=${message.body.training_list[i].id} WHERE id=${message.body.training_list[i].profession_groups[j].id};`);
            else if(message.body.training_list[i].profession_groups[j].status == 2)
              await Mysql.Request(`skos`, `INSERT INTO ProfessionGroupList(id_PG,id_training) VALUES(${message.body.training_list[i].profession_groups[j].id_PG},${message.body.training_list[i].id});`);
          }
          for(let j = 0; j < message.body.training_list[i].directions.length; j++) {
            if(message.body.training_list[i].directions[j].status == 0)
              await Mysql.Request(`skos`, `DELETE FROM DirectionList WHERE id=${message.body.training_list[i].directions[j].id};`);
            else if(message.body.training_list[i].directions[j].status == 1)
              await Mysql.Request(`skos`, `UPDATE DirectionList SET id_direction=${message.body.training_list[i].directions[j].id_direction},id_training=${message.body.training_list[i].id},count_people=${message.body.training_list[i].directions[j].count_people},date_start_training=${message.body.training_list[i].directions[j].date_start_training},date_start_industrial_training=${message.body.training_list[i].directions[j].date_start_industrial_training},date_end_industrial_training=${message.body.training_list[i].directions[j].date_end_industrial_training},date_exam=${message.body.training_list[i].directions[j].date_exam} WHERE id=${message.body.training_list[i].directions[j].id};`);
            else if(message.body.training_list[i].directions[j].status == 2)
              await Mysql.Request(`skos`, `INSERT INTO DirectionList(id_direction,id_training,count_people,date_start_training,date_start_industrial_training,date_end_industrial_training,date_exam) VALUES(${message.body.training_list[i].directions[j].id_direction},${message.body.training_list[i].id},${message.body.training_list[i].directions[j].count_people},${message.body.training_list[i].directions[j].date_start_training},${message.body.training_list[i].directions[j].date_start_industrial_training},${message.body.training_list[i].directions[j].date_end_industrial_training},${message.body.training_list[i].directions[j].date_exam});`);
          }
        } else if(message.body.training_list[i].status == 2) {
          let output = await Mysql.Request(`skos`, `INSERT INTO TrainingList(id_division,id_section,id_profession,table_type,academic_year,to1,per,indt,tren,exam,to2,po) VALUES(${message.body.training_list[i].id_division},${message.body.training_list[i].id_section},${message.body.training_list[i].id_profession},${message.body.training_list[i].table_type},${message.body.training_list[i].academic_year},${message.body.training_list[i].to1},${message.body.training_list[i].per},${message.body.training_list[i].indt},${message.body.training_list[i].tren},${message.body.training_list[i].exam},${message.body.training_list[i].to2},${message.body.training_list[i].po});`);
          for(let j = 0; j < message.body.training_list[i].profession_groups.length; j++) {
            await Mysql.Request(`skos`, `INSERT INTO ProfessionGroupList(id_PG,id_training) VALUES(${message.body.training_list[i].profession_groups[j].id_PG},${output.insertId});`);
          }
          for(let j = 0; j < message.body.training_list[i].directions.length; j++) {
            await Mysql.Request(`skos`, `INSERT INTO DirectionList(id_direction,id_training,count_people,date_start_training,date_start_industrial_training,date_end_industrial_training,date_exam) VALUES(${message.body.training_list[i].directions[j].id_direction},${output.insertId},${message.body.training_list[i].directions[j].count_people},${message.body.training_list[i].directions[j].date_start_training},${message.body.training_list[i].directions[j].date_start_industrial_training},${message.body.training_list[i].directions[j].date_end_industrial_training},${message.body.training_list[i].directions[j].date_exam});`);
          }
        }
      }
      
      data = "OK";
    }
    else if(message.body.request_type == "SAVE_STATEMENT") {
      for(let i = 0; i < message.body.training_list.length; i++) {
        if(message.body.training_list[i].status == 1) {
          for(let j = 0; j < message.body.training_list[i].directions.length; j++) {
            if(message.body.training_list[i].directions[j].status == 1) {
              await Mysql.Request(`skos`, `UPDATE DirectionList SET count_people=${message.body.training_list[i].directions[j].count_people},count_people_fact=${message.body.training_list[i].directions[j].count_people_fact},count_people_trained=${message.body.training_list[i].directions[j].count_people_trained} WHERE id=${message.body.training_list[i].directions[j].id};`);
            }
          }
        }
      }
      
      data = "OK";
    }

    return data;
  }

  /**
   * 
    */
  static async RequestTrainingList(message,training_list_params,profession_groups_params,direction_list_params) {
    let request = `SELECT ${training_list_params} FROM TrainingList`;

    //Выборка по where на sql запрос
    let where = [];
    if(typeof message.body.table_type != "undefined")
      where.push(`table_type=${message.body.table_type}`);
    if(typeof message.body.academic_year != "undefined")
      where.push(`academic_year=${message.body.academic_year}`);
    if(typeof message.body.id_division != "undefined")
      where.push(`id_division=${message.body.id_division}`);
    if(typeof message.body.id_profession != "undefined")
      where.push(`id_profession=${message.body.id_profession}`);
    if(where.length > 0) {
      request += ` WHERE ${where[0]}`;
      for(let i = 1; i < where.length; i++) {
        request += ` AND ${where[i]}`;
      }
    }
    //Выборка по where на sql запрос

    let data = await Mysql.Request(`skos`, request+";");

    //Добавление profession_groups и directions
    for(let i = 0; i < data.length; i++) {
      if(profession_groups_params != null) {
        data[i].profession_groups = await Mysql.Request(`skos`, `SELECT ${profession_groups_params} FROM ProfessionGroupList WHERE id_training=${data[i].id};`);
      }

      if(direction_list_params != null) {
        if(typeof message.body.id_direction != "undefined")
          data[i].directions = await Mysql.Request(`skos`, `SELECT ${direction_list_params} FROM DirectionList WHERE id_training=${data[i].id} AND id_direction=${message.body.id_direction};`);
        else data[i].directions = await Mysql.Request(`skos`, `SELECT ${direction_list_params} FROM DirectionList WHERE id_training=${data[i].id};`);

        for(let j = 0; j < data[i].directions.length; j++) { 
          if(typeof data[i].directions[j].date_start_training != "undefined") {
            let date_ = new Date(data[i].directions[j].date_start_training);
            data[i].directions[j].date_start_training = `${date_.getFullYear()}-${String(date_.getMonth()+1).padStart(2,'0')}-${String(date_.getDate()).padStart(2,'0')}`;
          }
          if(typeof data[i].directions[j].date_start_industrial_training != "undefined") {
            let date_ = new Date(data[i].directions[j].date_start_industrial_training);
            data[i].directions[j].date_start_industrial_training = `${date_.getFullYear()}-${String(date_.getMonth()+1).padStart(2,'0')}-${String(date_.getDate()).padStart(2,'0')}`;
          }
          if(typeof data[i].directions[j].date_end_industrial_training != "undefined") {
            let date_ = new Date(data[i].directions[j].date_end_industrial_training);
            data[i].directions[j].date_end_industrial_training = `${date_.getFullYear()}-${String(date_.getMonth()+1).padStart(2,'0')}-${String(date_.getDate()).padStart(2,'0')}`;
          }
          if(typeof data[i].directions[j].date_exam != "undefined") {
            let date_ = new Date(data[i].directions[j].date_exam);
            data[i].directions[j].date_exam = `${date_.getFullYear()}-${String(date_.getMonth()+1).padStart(2,'0')}-${String(date_.getDate()).padStart(2,'0')}`;
          }
        }
      }
    }
    //Добавление profession_groups и directions

    return data;
  }

  /**
   * 
    */
  static async CustomizeData(data, message) {
    let result = {};

    if(typeof message.body.table_type != "undefined")
      result.table_type = message.body.table_type;
    else result.table_type = -1;
    if(typeof message.body.academic_year != "undefined")
      result.year = message.body.academic_year;
    else result.year = -1;

    result.arr_plan_result = {};
    result.arr_plan_result.to1 = 0;
    result.arr_plan_result.per = 0;
    result.arr_plan_result.indt = 0;
    result.arr_plan_result.tren = 0;
    result.arr_plan_result.exam = 0;
    result.arr_plan_result.to2 = 0;
    result.arr_plan_result.po = 0;
    result.arr_plan_result.count_people = 0;
    result.arr_plan_result['directions'] = {};

    result.results = true;

    result.arr_plan = [];

    for(let i = 0; i < data.length; i++) {
      let search_division = false;
      for(let j = 0; j < result.arr_plan.length; j++) {
        if(data[i].id_division == result.arr_plan[j].division) {
          search_division = true;
          let search_title = false;
          for(let k = 0; k < result.arr_plan[j].arr_chapter.length; k++) {
            if(data[i].id_section == result.arr_plan[j].arr_chapter[k].title) {
              search_title = true;
              result.arr_plan[j].arr_chapter[k].arr_profession.push({});
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].id = data[i].id;
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].name = data[i].id_profession;
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].to1 = data[i].to1;
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].per = data[i].per;
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].indt = data[i].indt;
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].tren = data[i].tren;
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].exam = data[i].exam;
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].to2 = data[i].to2;
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].po = data[i].po;
              result.arr_plan[j].arr_chapter[k].arr_profession_results.to1 += data[i].to1;
              result.arr_plan[j].arr_chapter[k].arr_profession_results.per += data[i].per;
              result.arr_plan[j].arr_chapter[k].arr_profession_results.indt += data[i].indt;
              result.arr_plan[j].arr_chapter[k].arr_profession_results.tren += data[i].tren;
              result.arr_plan[j].arr_chapter[k].arr_profession_results.exam += data[i].exam;
              result.arr_plan[j].arr_chapter[k].arr_profession_results.to2 += data[i].to2;
              result.arr_plan[j].arr_chapter[k].arr_profession_results.po += data[i].po;
              result.arr_plan[j].arr_chapter_results.to1 += data[i].to1;
              result.arr_plan[j].arr_chapter_results.per += data[i].per;
              result.arr_plan[j].arr_chapter_results.indt += data[i].indt;
              result.arr_plan[j].arr_chapter_results.tren += data[i].tren;
              result.arr_plan[j].arr_chapter_results.exam += data[i].exam;
              result.arr_plan[j].arr_chapter_results.to2 += data[i].to2;
              result.arr_plan[j].arr_chapter_results.po += data[i].po;
              result.arr_plan_result.to1 += data[i].to1;
              result.arr_plan_result.per += data[i].per;
              result.arr_plan_result.indt += data[i].indt;
              result.arr_plan_result.tren += data[i].tren;
              result.arr_plan_result.exam += data[i].exam;
              result.arr_plan_result.to2 += data[i].to2;
              result.arr_plan_result.po += data[i].po;
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].code = [];
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].start_o = [];
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].start_po = [];
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].end_po = [];
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].qual_ex = [];
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].direction = [];
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].count = [];
              result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].count_people = 0;
              for(let h = 0; h < data[i].profession_groups.length; h++) {
                result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].code.push({id:data[i].profession_groups[h].id,name:data[i].profession_groups[h].id_PG});
              }
              for(let t = 0; t < data[i].directions.length; t++) {
                result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].start_o.push(data[i].directions[t].date_start_training);
                result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].start_po.push(data[i].directions[t].date_start_industrial_training);
                result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].end_po.push(data[i].directions[t].date_end_industrial_training);
                result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].qual_ex.push(data[i].directions[t].date_exam);
                result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].direction.push(data[i].directions[t].id_direction);
                result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].count.push(data[i].directions[t].count_people);
                result.arr_plan[j].arr_chapter[k].arr_profession[result.arr_plan[j].arr_chapter[k].arr_profession.length-1].count_people += data[i].directions[t].count_people;
                if(typeof result.arr_plan[j].arr_chapter[k].arr_profession_results['directions'][data[i].directions[t].id_direction] != "undefined")
                  result.arr_plan[j].arr_chapter[k].arr_profession_results['directions'][data[i].directions[t].id_direction] += data[i].directions[t].count_people;
                else result.arr_plan[j].arr_chapter[k].arr_profession_results['directions'][data[i].directions[t].id_direction] = data[i].directions[t].count_people;
                result.arr_plan[j].arr_chapter[k].arr_profession_results.count_people += data[i].directions[t].count_people;
                if(typeof result.arr_plan[j].arr_chapter_results['directions'][data[i].directions[t].id_direction] != "undefined")
                  result.arr_plan[j].arr_chapter_results['directions'][data[i].directions[t].id_direction] += data[i].directions[t].count_people;
                else result.arr_plan[j].arr_chapter_results['directions'][data[i].directions[t].id_direction] = data[i].directions[t].count_people;
                result.arr_plan[j].arr_chapter_results.count_people += data[i].directions[t].count_people;
                if(typeof result.arr_plan_result['directions'][data[i].directions[t].id_direction] != "undefined")
                  result.arr_plan_result['directions'][data[i].directions[t].id_direction] += data[i].directions[t].count_people;
                else result.arr_plan_result['directions'][data[i].directions[t].id_direction] = data[i].directions[t].count_people;
                result.arr_plan_result.count_people += data[i].directions[t].count_people;
              }
            }
          }
          if(search_title == false) {
            result.arr_plan[j].arr_chapter.push({});
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].title = data[i].id_section;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].results = true;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results = {};
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.to1 = 0;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.per = 0;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.indt = 0;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.tren = 0;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.exam = 0;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.to2 = 0;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.po = 0;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.count_people = 0;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results['directions'] = {};
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession = [];
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0] = {};
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].id = data[i].id;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].name = data[i].id_profession;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].to1 = data[i].to1;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].per = data[i].per;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].indt = data[i].indt;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].tren = data[i].tren;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].exam = data[i].exam;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].to2 = data[i].to2;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].po = data[i].po;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.to1 += data[i].to1;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.per += data[i].per;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.indt += data[i].indt;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.tren += data[i].tren;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.exam += data[i].exam;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.to2 += data[i].to2;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.po += data[i].po;
            result.arr_plan[j].arr_chapter_results.to1 += data[i].to1;
            result.arr_plan[j].arr_chapter_results.per += data[i].per;
            result.arr_plan[j].arr_chapter_results.indt += data[i].indt;
            result.arr_plan[j].arr_chapter_results.tren += data[i].tren;
            result.arr_plan[j].arr_chapter_results.exam += data[i].exam;
            result.arr_plan[j].arr_chapter_results.to2 += data[i].to2;
            result.arr_plan[j].arr_chapter_results.po += data[i].po;
            result.arr_plan_result.to1 += data[i].to1;
            result.arr_plan_result.per += data[i].per;
            result.arr_plan_result.indt += data[i].indt;
            result.arr_plan_result.tren += data[i].tren;
            result.arr_plan_result.exam += data[i].exam;
            result.arr_plan_result.to2 += data[i].to2;
            result.arr_plan_result.po += data[i].po;
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].code = [];
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].start_o = [];
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].start_po = [];
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].end_po = [];
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].qual_ex = [];
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].direction = [];
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].count = [];
            result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].count_people = 0;
            for(let h = 0; h < data[i].profession_groups.length; h++) {
              result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].code.push({id:data[i].profession_groups[h].id,name:data[i].profession_groups[h].id_PG});
            }
            for(let t = 0; t < data[i].directions.length; t++) {
              result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].start_o.push(data[i].directions[t].date_start_training);
              result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].start_po.push(data[i].directions[t].date_start_industrial_training);
              result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].end_po.push(data[i].directions[t].date_end_industrial_training);
              result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].qual_ex.push(data[i].directions[t].date_exam);
              result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].direction.push(data[i].directions[t].id_direction);
              result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].count.push(data[i].directions[t].count_people);
              result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession[0].count_people += data[i].directions[t].count_people;
              if(typeof result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results['directions'][data[i].directions[t].id_direction] != "undefined")
                result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results['directions'][data[i].directions[t].id_direction] += data[i].directions[t].count_people;
              else result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results['directions'][data[i].directions[t].id_direction] = data[i].directions[t].count_people;
              result.arr_plan[j].arr_chapter[result.arr_plan[j].arr_chapter.length-1].arr_profession_results.count_people += data[i].directions[t].count_people;
              if(typeof result.arr_plan[j].arr_chapter_results['directions'][data[i].directions[t].id_direction] != "undefined")
                result.arr_plan[j].arr_chapter_results['directions'][data[i].directions[t].id_direction] += data[i].directions[t].count_people;
              else result.arr_plan[j].arr_chapter_results['directions'][data[i].directions[t].id_direction] = data[i].directions[t].count_people;
              result.arr_plan[j].arr_chapter_results.count_people += data[i].directions[t].count_people;
              if(typeof result.arr_plan_result['directions'][data[i].directions[t].id_direction] != "undefined")
                result.arr_plan_result['directions'][data[i].directions[t].id_direction] += data[i].directions[t].count_people;
              else result.arr_plan_result['directions'][data[i].directions[t].id_direction] = data[i].directions[t].count_people;
              result.arr_plan_result.count_people += data[i].directions[t].count_people;
            }
          }
        }
      }
      if(search_division == false) {
        result.arr_plan.push({});
        result.arr_plan[result.arr_plan.length-1].division = data[i].id_division;
        result.arr_plan[result.arr_plan.length-1].results = true;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results = {};
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results.to1 = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results.per = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results.indt = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results.tren = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results.exam = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results.to2 = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results.po = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results.count_people = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results['directions'] = {};
        result.arr_plan[result.arr_plan.length-1].arr_chapter = [];
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0] = {};
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].title = data[i].id_section;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].results = true;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results = {};
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.to1 = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.per = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.indt = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.tren = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.exam = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.to2 = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.po = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.count_people = 0;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results['directions'] = {};
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession = [];
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0] = {};
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].id = data[i].id;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].name = data[i].id_profession;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].to1 = data[i].to1;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].per = data[i].per;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].indt = data[i].indt;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].tren = data[i].tren;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].exam = data[i].exam;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].to2 = data[i].to2;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].po = data[i].po;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.to1 += data[i].to1;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.per += data[i].per;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.indt += data[i].indt;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.tren += data[i].tren;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.exam += data[i].exam;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.to2 += data[i].to2;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.po += data[i].po;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results.to1 += data[i].to1;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results.per += data[i].per;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results.indt += data[i].indt;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results.tren += data[i].tren;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results.exam += data[i].exam;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results.to2 += data[i].to2;
        result.arr_plan[result.arr_plan.length-1].arr_chapter_results.po += data[i].po;
        result.arr_plan_result.to1 += data[i].to1;
        result.arr_plan_result.per += data[i].per;
        result.arr_plan_result.indt += data[i].indt;
        result.arr_plan_result.tren += data[i].tren;
        result.arr_plan_result.exam += data[i].exam;
        result.arr_plan_result.to2 += data[i].to2;
        result.arr_plan_result.po += data[i].po;
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].code = [];
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].start_o = [];
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].start_po = [];
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].end_po = [];
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].qual_ex = [];
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].direction = [];
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].count = [];
        result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].count_people = 0;
        for(let h = 0; h < data[i].profession_groups.length; h++) {
          result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].code.push({id:data[i].profession_groups[h].id,name:data[i].profession_groups[h].id_PG});
        }
        for(let t = 0; t < data[i].directions.length; t++) {
          result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].start_o.push(data[i].directions[t].date_start_training);
          result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].start_po.push(data[i].directions[t].date_start_industrial_training);
          result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].end_po.push(data[i].directions[t].date_end_industrial_training);
          result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].qual_ex.push(data[i].directions[t].date_exam);
          result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].direction.push(data[i].directions[t].id_direction);
          result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].count.push(data[i].directions[t].count_people);
          result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession[0].count_people += data[i].directions[t].count_people;
          if(typeof result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results['directions'][data[i].directions[t].id_direction] != "undefined")
            result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results['directions'][data[i].directions[t].id_direction] += data[i].directions[t].count_people;
          else result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results['directions'][data[i].directions[t].id_direction] = data[i].directions[t].count_people;
          result.arr_plan[result.arr_plan.length-1].arr_chapter[0].arr_profession_results.count_people += data[i].directions[t].count_people;
          if(typeof result.arr_plan[result.arr_plan.length-1].arr_chapter_results['directions'][data[i].directions[t].id_direction] != "undefined")
            result.arr_plan[result.arr_plan.length-1].arr_chapter_results['directions'][data[i].directions[t].id_direction] += data[i].directions[t].count_people;
          else result.arr_plan[result.arr_plan.length-1].arr_chapter_results['directions'][data[i].directions[t].id_direction] = data[i].directions[t].count_people;
          result.arr_plan[result.arr_plan.length-1].arr_chapter_results.count_people += data[i].directions[t].count_people;
          if(typeof result.arr_plan_result['directions'][data[i].directions[t].id_direction] != "undefined")
            result.arr_plan_result['directions'][data[i].directions[t].id_direction] += data[i].directions[t].count_people;
          else result.arr_plan_result['directions'][data[i].directions[t].id_direction] = data[i].directions[t].count_people;
          result.arr_plan_result.count_people += data[i].directions[t].count_people;
        }
      }
    }

    return result;
  }
}

//-----------Экспортируемые модули-----------//
module.exports = Table;
//-----------Экспортируемые модули-----------//