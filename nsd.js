'use strict';
var request  = require('request');
var cheerio  = require('cheerio');
var moment = require('moment');
var _ = require('lodash');

module.exports = {

  getResults: function(url, cb) {
		request(url, function (error, response, body) {
		  if (!error && response.statusCode == 200) {

		  	var $html = cheerio.load(body, {
			    normalizeWhitespace: false,
			    xmlMode: false,
			    decodeEntities: true
			});

		  	var $table = $html('table.result tbody');

		  	var allresults = [];
		  	var response = {};
		  	response.title = $html('h1').eq(0).text().replace('Skolevalgresultater for ', '').trim();

		  	var real_parties = ['RØDT', 'SV', 'A', 'SP', 'MDG', 'KRF', 'V', 'H', 'FRP'];

		  	$table.find('tr').each(function(i, elem) {
		  		var res = {}
		  		res.partycode = $html(this).find('th').text().toUpperCase();
		  		res.share = +$html(this).find('td').eq(1).text();
		  		res.share_change = +$html(this).find('td').eq(2).text();
		  		allresults.push(res);
		  	});

		  	var partygroups = _.partition(allresults, function(r) {
						  return _.includes(real_parties, r.partycode);
						});

		  	response.results = partygroups[0];

		  	var others = {
		  		partycode: 'Andre',
		  		share: _.sum(partygroups[1], 'share'),
		  		share_change: null //_.sum(partygroups[1], 'share_change')
		  	};


		  	response.results.push(others);

		    cb(response);
		  } else {
		  	console.log(error)
		  }
		});
	}
};


