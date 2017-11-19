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

    name: "[test] Store Variable From WebAPI",

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
        return `${data.varName} | JSON Var: ${data.jsonStorageVarName} | Path: ${data.path}`;
    },

    //---------------------------------------------------------------------
    // Action Storage Function
    //
    // Stores the relevant variable info for the editor.
    //---------------------------------------------------------------------

    variableStorage: function(data, varType) {
        const type = parseInt(data.storage);
        if (type !== varType) return;       
        return ([data.varName, 'JSON Object']);
    },

    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------

    fields: ["behavior", "url", "path", "storage", "varName", "storage2","jsonStorageVarName", "jsonStorage"],

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
		<div>
		<div style="float: left; width: 70%;">
		<div>
			End Behavior:<br>
			<select id="behavior" class="round">
				<option value="0" selected>Call Next Action Automatically</option>
				<option value="1">Do Not Call Next Action</option>
			</select>
		<div><br>
			WebAPI URL:  <br>
			<input id="url" class="round" placeholder="If blank Json Storage is used." style="width: 90%; type="text";><br> 
			
		</div>
        <div>
            <div style="float: left; width: 35%;">
                Store In:<br>
                <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
                    ${data.variables[0]}
                </select>
            </div>
            <div id="varNameContainer2" style="display: none; float: right; width: 55%;">
			    Json Storage Variable Name:  <br>
                <input id="jsonStorageVarName" class="round" type="text";><br>  
            </div>
		</div>
		</div>
			JSON Path:  <br>
			<input id="path" class="round"; style="width: 75%;" type="text"><br>  
		<div>
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 55%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text">
		</div>
			<div style="display: none;">
				<input id="jsonStorage" class="round" type="text">
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
        const {
            glob,
            document
        } = this;
        glob.variableChange(document.getElementById('storage'), 'varNameContainer');
        glob.variableChange(document.getElementById('storage2'), 'varNameContainer2');
    },

    //---------------------------------------------------------------------
    // Action Bot Function
    //
    // This is the function for the action within the Bot's Action class.
    // Keep in mind event calls won't have access to the "msg" parameter, 
    // so be sure to provide checks for variable existance.
    //---------------------------------------------------------------------

    action: function(cache) {
        //const _this = this;

        const data = cache.actions[cache.index];
        
        const varName = this.evalMessage(data.varName, cache);
        const storage = parseInt(data.storage);
        const storage2 = parseInt(data.storage2);
        const url = this.evalMessage(data.url, cache);
        const path = this.evalMessage(data.path, cache);
		const jsonStorageVarName = this.evalMessage(data.jsonStorageVarName, cache);		
        const jsonStorage = data.jsonStorage;

		
        try {
            if (url && jsonStorage) {
                console.log('WebAPI Parser: URL and JSON Data exists, saving data from URL: ' + url);
                var myData = GetJSONFromURL(url, path, varName, jsonStorageVarName, cache); // refresh the saved json

                if(myData.result && varName){
                    this.storeValue(myData.result, storage, varName, cache);
                    console.log("WebAPI Parser: Saved Result");
                }
                
                if(jsonStorageVarName){
                    this.storeValue(jsonStorage, storage2, jsonStorageVarName, cache);
                    console.log("WebAPI Parser: Saved JsonStorage");
                }

                if (data.behavior === "0") {
                    this.callNextAction(cache);
                }

            } else if (!url && jsonStorage) {
                console.log('WebAPI Parser: Using saved JSON under variable name: ' + jsonStorageVarName);
                try {
                    if (path && jsonStorage) {
                        var result = eval("jsonStorage." + path);
                        console.log("WebAPI Parser: The Parse result returned: " + result);
                        
                        if(jsonStorageVarName){
                            this.storeValue(jsonStorage, storage2, jsonStorageVarName, cache);
                            console.log("WebAPI Parser: Saved JsonStorage");
                        }
        
                        if (data.behavior === "0") {
                            this.callNextAction(cache);
                        }
                    }
                } catch (err) {
                    console.log("WebAPI Parser: Saved JSON Error: " + err);
                }

            } else if (url && !jsonStorage) {
                console.log('WebAPI Parser: URL Exists, JSON Data does not, saving data from URL: ' + url);
                var myData = GetJSONFromURL(url, path, varName, jsonStorageVarName, cache); 

                if(myData.result && varName){
                    this.storeValue(myData.result, storage, varName, cache);
                    console.log("WebAPI Parser: Saved Result");
                }
                
                if(jsonStorageVarName){
                    this.storeValue(jsonStorage, storage2, jsonStorageVarName, cache);
                    console.log("WebAPI Parser: Saved JsonStorage");
                }

                if (data.behavior === "0") {
                    console.log("WebAPI Parser: Calling Next Action");
                    this.callNextAction(cache);
                }
            } else {
                GetJSONFromURL(url, path, varName, jsonStorageVarName, cache); // default to getting new data
            }
        } catch (error) {
            console.log("WebAPI Parser: Main Function Error: " + error);
        }


        function GetJSONFromURL(url, path, varName, jsonStorageVarName, cache) {

            var myData = {};
            myData.result = null;
            myData.jsonStorage = null;

            let result;

            try {
                if (url && path) {
                    var request = require('request');
                    request.get({
                        url: url,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, jsonData) => {
                        if (err) {
                            result = "error: " + err;
                            console.log("WebAPI Parser: The Parse result returned an error: " + result);
                            myData.result = result;
                        } else if (res.statusCode !== 200) {
                            result = "status: " + res.statusCode;
                            console.log("WebAPI Parser: The Parse result returned an error: " + result);
                            myData.result = result;
						}else{
                            jsonstorage = jsonData;
                            result = eval("jsonData." + path, cache);

                            myData.result = result;
                            myData.jsonStorage = jsonStorage;

                            console.log("WebAPI Parser: The Parse result returned: " + result);                            
                        }
                    });                  
                    return myData;
                }
            } catch (err) {
                console.log("WebAPI Parser: GetJSONFromURL Error: " + err);
            }
        }  
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


    }


}; // End of module