'use strict';

const http = require('http');

const ajax = (base, methods) => {
	const api = {};
	for (const method of methods) {
		api[method] = (...args) => {
			const callback = args.pop();
			const url = base + method + '/' + args.join('/');
			console.log(url);
			http.get(url, res => {
				if (res.statusCode !== 200) {
					console.log(res.statusCode);
					callback(new Error(`Status code: ${res.statusCode}`));
					return;
				}
				const buffer = [];
				res.on('data', chunk => buffer.push(chunk));
				res.on('end', () => callback(null, JSON.stringify(buffer.join())));
			});
		};
	}
	return api;
};

// Usage

const api = ajax(
	'http://localhost:8000/api/',
	['user', 'userBorn']
);

api.user('marcus', (err, data) => {
	if (err) throw err;
	console.dir({ data: JSON.parse(data) });
	console.dir({ data: data.split('\\').join('') });
});

api.userBorn('mao', (err, data) => {
	if (err) throw err;
	console.dir({ data });
});