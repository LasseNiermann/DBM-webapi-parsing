document.getElementById("checkurlbtn").onclick = function() {validURL()};

		function validURL() {
			var text = "";
			var str = document.getElementById('url').InnerHTML;
			var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
			  '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
			  '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
			  '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
			  '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
			  '(\#[-a-z\d_]*)?$','i'); // fragment locater
			if(!pattern.test(str)) {
			  alert("Please enter a valid URL.");
			  text = '<font color="red">URL Is Not Valid!</font>';							  
			  return false;
			} else {
			  text = '<font color="green">URL Is Not Valid!</font>';	
			  return true;
			}		  
		  document.getElementById('url-label').InnerHTML = text;
		}