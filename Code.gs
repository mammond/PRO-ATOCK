/**
 * Google Apps Script Backend for Inventory Management System
 * 
 * Instructions:
 * 1. Create a new Google Sheet.
 * 2. Create 4 sheets named: "Supplies", "Equipment", "Transactions", "Requests".
 * 3. Add headers to each sheet as specified in the documentation.
 * 4. Open Extensions > Apps Script.
 * 5. Paste this code into Code.gs.
 * 6. Deploy as Web App (Execute as: Me, Who has access: Anyone).
 */

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Optional if script is bound to sheet

function doGet(e) {
  return HtmlService.createHtmlOutput("API is running. Use POST for requests.");
}

function doPost(e) {
  const action = e.parameter.action;
  const payload = JSON.parse(e.postData.contents);
  
  try {
    let result;
    switch(action) {
      case 'getDashboardData': result = getDashboardData(); break;
      case 'getAllSupplies': result = getAllSupplies(); break;
      case 'addSupply': result = addSupply(payload); break;
      case 'updateSupply': result = updateSupply(payload); break;
      case 'deleteSupply': result = deleteSupply(payload.id); break;
      case 'getEquipment': result = getEquipment(); break;
      case 'addEquipment': result = addEquipment(payload); break;
      case 'updateEquipment': result = updateEquipment(payload); break;
      case 'deleteEquipment': result = deleteEquipment(payload.id); break;
      case 'recordTransaction': result = recordTransaction(payload); break;
      case 'submitRequest': result = submitRequest(payload); break;
      case 'updateRequest': result = updateRequest(payload); break;
      default: throw new Error('Invalid action');
    }
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({error: err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheet(name) {
  const ss = SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name);
}

function getAllSupplies() {
  const sheet = getSheet("Supplies");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  return data.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function addSupply(item) {
  const sheet = getSheet("Supplies");
  const id = "S" + Utilities.formatDate(new Date(), "GMT", "yyyyMMddHHmmss");
  sheet.appendRow([id, item.itemName, item.category, item.quantity, item.unit, item.reorderLevel]);
  return {id, ...item};
}

function updateSupply(item) {
  const sheet = getSheet("Supplies");
  const data = sheet.getDataRange().getValues();
  for(let i=1; i<data.length; i++) {
    if(data[i][0] == item.id) {
      sheet.getRange(i+1, 1, 1, 6).setValues([[item.id, item.itemName, item.category, item.quantity, item.unit, item.reorderLevel]]);
      return item;
    }
  }
}

function deleteSupply(id) {
  const sheet = getSheet("Supplies");
  const data = sheet.getDataRange().getValues();
  for(let i=1; i<data.length; i++) {
    if(data[i][0] == id) {
      sheet.deleteRow(i+1);
      return {success: true};
    }
  }
}

// ... Similar functions for Equipment, Transactions, and Requests ...

function getDashboardData() {
  const supplies = getAllSupplies();
  const equipment = getEquipment();
  const txSheet = getSheet("Transactions");
  const txData = txSheet.getDataRange().getValues();
  txData.shift();
  
  const lowStockItems = supplies.filter(s => s.quantity <= s.reorderLevel);
  
  return {
    totalSupplies: supplies.length,
    totalEquipment: equipment.length,
    lowStockCount: lowStockItems.length,
    recentTransactions: txData.slice(-10).reverse().map(row => ({
      id: row[0], type: row[1], item: row[2], quantity: row[3], date: row[4]
    })),
    lowStockItems: lowStockItems
  };
}
