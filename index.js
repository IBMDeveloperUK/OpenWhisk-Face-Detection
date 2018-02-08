const watson = require('watson-developer-cloud');

function parse_query_parameters(querystring){

	const parameters = {};

	querystring.split('&').forEach(keyValuePair => {
		const split = keyValuePair.split('=');
		parameters[split[0]] = split[1];
	});

	return parameters;

}

function main(args) {

	args.parsedQueryString = parse_query_parameters( args['__ow_query'] );

	return new Promise((resolve, reject) => {

		if(!args.parsedQueryString.userSecret){

			reject({
				status : 'err',
				message : `Invalid input. You need to pass a key using the userSecret query parameter`
			});

		} else if (args.parsedQueryString.userSecret !== args['USER_SECRET']){
		
			reject({
				status : 'err',
				message : `Sorry, you're not authorised to do that.`
			});

		} else {

			const visual_recognition = watson.visual_recognition({
				api_key: args.parsedQueryString.apiKey,
				version: 'v3',
				version_date: '2016-05-20'
			});
	
			var params =  {
				images_file: {
					value: Buffer.from(args['__ow_body'], 'base64'),
					 options: {
						filename: 'image.jpg'
					 }
				},
				images_file_content_type : 'image/jpeg'
			};
	
			visual_recognition.detectFaces(params, function(err, results) {
				if (err){
					reject(err);
				} else{
					resolve(results);
				}
			});

		}

	});

}

exports.main = main;
