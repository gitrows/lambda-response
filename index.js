const description=require('./lib/descriptions.js');

module.exports = (code,payload,headers={},isBase64Encoded=false,options={})=>{
	let response={
		"statusCode": code,
		"statusDescription": description[code],
		"isBase64Encoded": isBase64Encoded,
		"headers":headers
	};
	response.headers['Access-Control-Allow-Origin']=response.headers['Access-Control-Allow-Origin']|| '*';
	response.headers['Content-Type']=response.headers['Content-Type']||"application/json";

	switch (options.format) {

		case 'html':
			let templates=require("dot").process({ path: __dirname+"/views"});
			response.headers['Content-Type']="text/html";
			response.statusCode=200;
			response.body=templates[options.template||'index']({...response,...options});
			break;

		case 'redirect':
			if (typeof options.redirect!='undefined'){
				let location=(code<400?options.redirect.success:options.redirect.error)||'';
				if (~location.indexOf('//')&&options.referer&&options.origin){
					if (location.charAt(0)=='/')
						location=options.origin+location;
					else
						location=options.referer+location;
				}
				response.headers['Location']=location;
				delete(response.headers['Content-Type']);
				response.statusCode=200;
				response.body='';
			}
			break;

		default:
			if (typeof payload=='undefined')
				payload={
					"code": code,
					"message": description[code],
					"documentation":[{
						"description":"HTTP Status Codes",
						"url":'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/'+code
					}]
				};
			if (code==400&&payload.documentation){
				payload.documentation.push({description:"GitRows API Documentation","url":"https://gitrows.com/docs/api/path"})
			}
			if (typeof payload=='object')
				payload=JSON.stringify(payload);
			response.body=payload;
	}
	return response;
}
