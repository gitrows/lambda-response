const description=require('./lib/descriptions.js');

module.exports = (code,payload,headers={},isBase64Encoded=false)=>{
	let response={
		"statusCode": code,
		"statusDescription": description[code],
		"isBase64Encoded": isBase64Encoded,
		"headers":headers
	};
	response.headers['Access-Control-Allow-Origin']=response.headers['Access-Control-Allow-Origin']|| '*';
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

	response.headers['Content-Type']="application/json"
	response.body=payload;
	return response;
}
