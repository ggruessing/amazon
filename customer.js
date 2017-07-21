
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

var customer = function(){
	info = {}
	table = []
	tblr()	
inquirer.prompt([
		{
			type: "input",
			message: "What item would you like to buy? Select by ID:",
			name: "pick"
		}
	]).then(function(second){
		
		console.log(table.toString())
		inquirer.prompt([
				{
					type: "input",
					message: "How many would wou like to buy?",
					name: "amount"
				}
			]).then(function(third){
				connection.query("SELECT price FROM inventory WHERE id=?" ,[second.pick], function(err , res) {
					var num =parseInt(second.pick) - 1
					console.log(num)
				
					if (parseInt(third.amount) <= parseInt(info[num].stock)){
						console.log("Huzzah, you bought some "+info[num].name+" for "+(third.amount*info[num].price)+" bucks")
						var newStock = (parseInt(info[num].stock)-parseInt(third.amount))
						connection.query("UPDATE inventory SET stock=? WHERE id=?", [newStock,second.pick], function(err, res){
							if(err) throw err;
							console.log("Inventory updated")
							inquirer.prompt([
								{
									type: "confirm",
									message: "Keep Shopping?",
									name: "restart"
								}
							]).then(function(fth){
								if(fth.restart){
									customer()
								}
								else
									console.log("Later Tater")
							})
							else{
								console.log("Not enough in stock.")
								inquirer.prompt([
								{
									type: "confirm",
									message: "Keep Shopping?",
									name: "restart"
								}
							]).then(function(fth){
								if(fth.restart){
									customer()
								}
							}
							
							

						})
					}
				})
			})
	})
}

module.exports = customer