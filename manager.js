var mysql = require("mysql")
var inquirer = require("inquirer")
var Table = require('cli-table');
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "notmysql",
	database: "amazon_db",
});

var table = new Table({
    head: ['id', 'item', 'department', 'price', 'stock']
  , colWidths: [5, 10, 25, 10, 10]
});

var info = {}

var tblr = function(){
	var table = new Table({
    head: ['id', 'item', 'department', 'price', 'stock']
  , colWidths: [5, 10, 25, 10, 10]
});
	connection.query("SELECT * FROM inventory" , function(err,res){
		if (err) throw err;
		info = res
		for (var i = 0; i < info.length; i++) {
			table.push(
				[info[i].id, info[i].name, info[i].department, info[i].price, info[i].stock],
			);
		}
		console.log("")
		console.log(table.toString())
	})
}

var manager = function(){
	info = {}
	table = []	
inquirer.prompt([
		{
			type: "list",
			message: "Hello Manager, what needs to be done?",
			name: "pick",
			choices: ["view products","low inventory","add to inventory","add new product"]
		}
	]).then(function(second){
		switch(second.pick){
			case "view products":
				tblr()
				inquirer.prompt([
								{
									type: "confirm",
									message: "Keep Shopping?",
									name: "restart"
								}
							]).then(function(fifth){
								if(fifth.restart){
									manager()
								}
								else{
									console.log("Later Tater")
								}
						})
				break;
			case "low inventory":

				break;
			case "add to inventory":
				console.log(table.toString())
		inquirer.prompt([
				{
					type: "input",
					message: "What needs an addition? Select by ID",
					name: "amount"
				}
			]).then(function(third){
					var num =parseInt(second.pick) - 1
						inquirer.prompt([
				{
					type: "input",
					message: "Replenish stock to how many??",
					name: "amount"
				}
			]).then(function(fourth){
						connection.query("UPDATE inventory SET stock=? WHERE id=?", [fourth.amount,third.amount], function(err, res){
							if(err) throw err;
							console.log("Inventory updated")
							inquirer.prompt([
								{
									type: "confirm",
									message: "Keep Shopping?",
									name: "restart"
								}
							]).then(function(fifth){
								if(fifth.restart){
									manager()
								}
								else{
									console.log("Later Tater")
								}
						})
					})
				})
		})
			
				break;
			case "add new product":
			inquirer.prompt([
				{
					type: "input",
					message: "",
					name: "amount"
				}
			]).then(function(third){
					var num =parseInt(second.pick) - 1
						inquirer.prompt([
				{
					type: "input",
					message: "Replenish stock to how many??",
					name: "amount"
				}
			]).then(function(fourth){
						connection.query("UPDATE inventory SET stock=? WHERE id=?", [fourth.amount,third.amount], function(err, res){
							if(err) throw err;
							console.log("Inventory updated")
							inquirer.prompt([
								{
									type: "confirm",
									message: "Keep Shopping?",
									name: "restart"
								}
							]).then(function(fifth){
								if(fifth.restart){
									manager()
								}
								else{
									console.log("Later Tater")
								}
						})
					})
				})

				break;
		}
	})
}
		

module.exports = manager