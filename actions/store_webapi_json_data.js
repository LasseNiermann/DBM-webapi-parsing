module.exports = {
	//---------------------------------------------------------------------
	// Created by General Wrex
	// Add URL to json object,
	// add path to the object you want from the json
	// set your variable type and name
	// example URL: https://api.github.com/repos/HellionCommunity/HellionExtendedServer/releases/latest
	// example Path: name
	// will return object.name
	// in this example the variable would contain "[DEV] Version 1.2.2.3"
	//---------------------------------------------------------------------
		
		
		
	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------
	
	name: "Store WebAPI JSON Data",
	
	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------
	
	section: "JSON WebAPI Parsing",
	
	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------
	
	subtitle: function(data) {
		
		if(this.WrexMODS.checkUrl(data.url)){
			data.isURL = '<font color="Green">Valid!</font>';
		}else{
			data.isURL = '<font color="red">Not Valid!</font>';
		}

		if(this.WrexMODS.checkValid(data.url)){
			data.isJSON = '<font color="Green">Valid!</font>';
		}else{
			data.isJSON = '<font color="red">Not Valid!</font>';
		}

		return `${"Valid URL: " + data.isURL + " Valid JSON: " + data.isJSON}`;
	},
	
	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------
	
	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, 'JSON Data']);
	},
	
	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------
	
	fields: ["isJSON","isURL","token","username","password","url", "storage", "varName"],
	
	//---------------------------------------------------------------------
	// Command HTML
	//
	// This function returns a string containing the HTML used for
	// editing actions. 
	//
	// The "isEvent" parameter will be true if this action is being used
	// for an event. Due to their nature, events lack certain information, 
	// so edit the HTML to reflect this.
	//
	// The "data" parameter stores constants for select elements to use. 
	// Each is an array: index 0 for commands, index 1 for events.
	// The names are: sendTargets, members, roles, channels, 
	//                messages, servers, variables
	//---------------------------------------------------------------------
	
	html: function(isEvent, data) {
		return `
		<div style="float: top;">
		<div class="round" style="float: left; width: 90%;">
			WebAPI URL: <br>
			<input id="url" class="round" placeholder="http://api.website.com/my/path/to/json" type="text">
      		Save the action and look to the right of the action to find out if the url is valid and contains JSON.<br>    
		</div>
	</div>
	<div><br><br><br><br><br> Token: <br>
		<input id="token" class="round" style="width: 90%" placeholder="The Token or blank for none.." type="text"><br> --- OR ---
	</div>
	<div style="float: left; width: 50%">
		Username: <br>
		<input id="username" class="round" style="width: 90%" placeholder="Your username or blank for none.." type="text"><br><br>
	</div>
	<div style="float: right; width: 50%">
		Password: <br>
		<input id="password" class="round" style="width: 90%" placeholder="Your password or blank for none.." type="password"><br><br>
	</div>
	<div>
		<div style="float: left; width: 30%;">
			Store JSON Data In:<br>
			<select id="storage" class="round">
				${data.variables[1]}
			  </select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
	</div>`
	},
	
	//---------------------------------------------------------------------
	// Action Editor Init Code
	//
	// When the HTML is first applied to the action editor, this code
	// is also run. This helps add modifications or setup reactionary
	// functions for the DOM elements.
	//---------------------------------------------------------------------
	
	init: function() {		
	},
	
	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter, 
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------
	
	action: function(cache) {	
		const data = cache.actions[cache.index];

		const mydata = null;
		var jsonresult;
			
		mydata.varName = this.evalMessage(data.varName, cache);
		mydata.storage = parseInt(data.storage);
		mydata.url = this.evalMessage(data.url, cache);
		mydata.token = data.token;
		mydata.user = data.username;
		mydata.pass = data.password;
			
		
		if(this.WrexMODS.checkUrl(mydata.url)){
			data.isURL = '<font color="Green">Valid!</font>';
		}else{
			data.isURL = '<font color="red">Not Valid!</font>';
		}

		if(this.WrexMODS.checkValid(mydata.url)){
			data.isJSON = '<font color="Green">Valid!</font>';
		}else{
			data.isJSON = '<font color="red">Not Valid!</font>';
		}

		mydata.jsonresult = jsonresult;
		this.WrexMODS.data = mydata;

		//if(jsonresult){
		//this.storeValue(result, storage, varName, cache);	
		//}
		this.callNextAction(cache);
	},
	
	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//---------------------------------------------------------------------
	
	mod: function(DBM) {

		if(!DBM.Actions.WrexMODS){
			DBM.Actions.WrexMODS = {};
        }
        		
		const request = require('request');

		DBM.Actions.WrexMODS.checkUrl = function(str){
			var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
			  '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
			  '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
			  '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
			  '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
			  '(\#[-a-z\d_]*)?$','i'); // fragment locater
			if(!pattern.test(str)) {						  
			  return false;
			} else {
			  return true;
			}		  
		};

		DBM.Actions.WrexMODS.runRequest = function(url){

			if(!url) return;

			var result = null;
			request.get({
				url: url,
				json: true,
				headers: {'User-Agent': 'request'}
			  }, (err, res, jsonData) => {
				if (err) {
				  console.log("The Parse result returned an error: " + result);  
				} else if (res.statusCode !== 200) {
				  console.log("The Parse result returned an error: " + result);	  
				} else {
				  console.log("The Parse result returned: " + result);  						  					  
				}
				return result;
			});
		};

		DBM.Actions.WrexMODS.checkValid = function(url){
			
			if(!url) return;

			var requestdata = this.WrexMODS.runRequest(url);

			if (typeof requestdata == 'object') { 
				try{ m = JSON.stringify(requestdata); }
				catch(err) { return false; } }
		  
			 if (typeof requestdata == 'string') {
				try{ m = JSON.parse(requestdata); }
				catch (err) { return false; } }
		  
			 if (typeof requestdata != 'object') { return false; }

			 return true;
		};

		DBM.Actions.WrexMODS.getJSONData = function(user, pass, token, url){

			if (!url) return;
		
			if (user && pass){ // user auth

			
			}else if (token){ //token auth

			
			}else{ // no auth

			}

			return JSON.parse(jsonresult);
		};
	}
		
}; // End of module