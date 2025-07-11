//-----------Подключаемые модули-----------//
const Roles = require('./../Data/Roles');
const Authorization = require('./../Server/Authorization');
const ValidationData = require('./../Server/ValidationData');
const Excel = require('./Excel');
const Aspose = require("aspose.cells.java");
const fs = require('fs');
const pdflib = require('pdf-lib');
//-----------Подключаемые модули-----------//

/**
 * Класс для работы с Docx документами
 */
class Pdf {

  static path_save = '/var/www/SKOS/pdf/';

  /**
   * 
   */
  static async Post(message) {
    if(!(await ValidationData.PdfPost(message))) return {error: "Bad data"};

    let token = await Authorization.TokenInfo(message);
    if(!token.token_verify) return {error: "Bad token"};

    //if(!(await Roles.PermissionsDocx(message, token.token_info.role))) return {error: "Permission denied"};

    let data = "OK";

    if(message.body.type_request == "generate") {
      data = await Pdf.Generate(message);
    } else {
      data = "Bad type";
    }

    return data;
  }

  /**
   * 
   */
  static async Generate(message) {
    let key;

    /** Проверка на форму документа */
    if (message.body.form == 'report') {
      key = `${message.body.form}_${new Date().getTime()}`;
      await Pdf.GenerateReport(message, key);
    } else {
      return "Bad form document";
    }
    
    return key;
  }

  /**
   * 
   */
  static async GenerateReport(message, key) {
    let excel = new Aspose.Workbook(Aspose.FileFormatType.XLSX);
    await Excel.GenerateReport(message, excel);

    let pdf = new Aspose.PdfSaveOptions();
    excel.save(Pdf.path_save + `${key}.pdf`, pdf);
    
    await Pdf.DeleteCopyright(key);
  }

  /**
   * 
   */
  static async DeleteCopyright(key) {
    let document = await pdflib.PDFDocument.load(fs.readFileSync(Pdf.path_save + `${key}.pdf`));
    let page_count = document.getPageCount();
    let imgBuffer = fs.readFileSync("./../imgs/white.png");
    let img = await document.embedPng(imgBuffer);

    let { height } = img.scale(0.5);

    for(let i = 0; i < page_count; i++) {
      let page = document.getPage(i);

      page.drawImage(img, {
        x: 0,
        y: page.getHeight() - height,
      });
    }

    fs.writeFileSync(Pdf.path_save + `${key}.pdf`, await document.save());
  }
}

//-----------Экспортируемые модули-----------//
module.exports = Pdf;
//-----------Экспортируемые модули-----------//