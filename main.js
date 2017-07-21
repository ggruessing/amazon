var mysql = require("mysql")
var inquirer = require("inquirer")
var customer = require("./customer.js")
var manager = require("./manager.js")

var Table = require('cli-table');
 
// instantiate 
// var table = new Table({
//     head: ['id', 'item', 'department', 'price', 'stock']
//   , colWidths: [100, 200, 200, 200, 200]
// });
 
// // table is an Array, so you can `push`, `unshift`, `splice` and friends 
// table.push(
//     ['First value', 'Second value']
//   , ['First value', 'Second value']
// );
 
// console.log(table.toString());

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "notmysql",
	database: "amazon_db",
});

inquirer.prompt([
		{
			type: "list",
			message: "Are you a customer or the manager?",
			choices: ["customer","manager"],
			name: "first"
		}
	]).then(function(the){
		switch(the.first){
			
			case "manager":
				manager()
				break;

			case "customer":
				customer()
				break;
		}
	})
	