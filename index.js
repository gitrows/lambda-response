const description=require('./lib/descriptions.js');

exports.response = (code,payload,headers={})=>{
	let response={
		"statusCode": code,
		"statusDescription": description[code],
		"isBase64Encoded": false,
		"headers":headers
	};
	response.headers['Access-Control-Allow-Origin'] = '*';
	if (typeof payload=='undefined')
		payload={
			"message": description[code],
			"documentation_url":'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/'+code
		}
	if (typeof payload=='object'){
		payload=JSON.stringify(payload);
		response.headers['Content-Type']="application/json"
	} else {
		response.headers['Content-Type']="text/html; charset=UTF-8"
	}
	response.body=payload;
	return response;
}
