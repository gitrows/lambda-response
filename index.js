const description=require('lib/description.js');

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
		}
	if (typeof payload=='object'){
		payload=JSON.stringify(payload);
		response.headers['Content-Type']="application/json"
	} else {
		response.headers['Content-Type']="text/html; charset=UTF-8"
	}
	if (code>=400&&typeof payload.documentation_url=='undefined')
		payload.documentation_url='https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/'+code;
	response.body=payload;
	return response;
}
