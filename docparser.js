const cheerio = require('cheerio');
const request = require('request');

module.exports = (html) => {
	let $ = cheerio.load(html);
	let getDomain = url => {
		let host_reg = /^((http:|https:|)\/\/)([^\/]+[.][^\/]+)*/g,
			protocol_reg = /((http:|https:|)\/\/)/;
		return url.match(host_reg)[0].replace(protocol_reg, '').replace(/wwww[.]/i, '');
	}; 
	let getHostname = url => {
		let host_reg = /^((http:|https:|)\/\/)([^\/]+[.][^\/]+)*/g;
		return url.match(host_reg)[0];
	};
	let getDoctype = () => {
		let heading = 'Html version';
		let doctype_reg = /<!DOCTYPE([^>]+)>/ig;
		let html5_reg = /<!DOCTYPE html>/i;
		let html_verion_reg = /DTD (?=HTML|XHTML)([^\/]+)(?=\/\/)/ig;
		let doctype = html.match(doctype_reg)[0];
		if (html5_reg.test(doctype)) {
			content = 'html5';
		} else {
			content = doctype.match(html_verion_reg)[0];
		}
		
		return { heading, content };
	};
	let getPagetitle = () => {
		let heading = 'Page title';
		let content = $('title').text();
		return { heading, content };
	};
	let getHeadings = () => {
		let heading = 'Headings';
		let content = [];
		let headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
		// find all the headings on the page 
		headings.forEach( (ele) => {
			let length = $(ele).length;
			if (length > 0) {
				let level = ele;
				let count = length;
				content.push({ level, count });
			}
		});
		return { heading, content };
	};
	let getLinks = (url) => {
		let heading = 'Links';
		let content = [];
		let internal_links = [];
		let external_links = [];
		let domain = getDomain(url);
		let isInternalLinks = (domain, link) => {
			// internal links have the same domain
			// all the <link> tags 
			// and <a> which points to internal section, <a href="#section1">
			let protocol_reg = /((http:|https:|)\/\/)/;
			let is_same_domain = link.replace(protocol_reg, '').indexOf(domain) === 0;
			let is_internal_anchor = /^#/.test(link);
			let is_internal_source = /^\/(?!\/)/.test(link);
			return is_same_domain || is_internal_anchor || is_internal_source;
		};

		let getBrokenLinks = (links_arr) => {
			/**
			* @TODO find a better way to deteck the inaccessible links
			*/
			// clone the array
			let arr = [...links_arr];
			let brokens = [];
			while(arr.length >0) {
				let link = arr.shift();
				let is_internal_anchor = /^#/.test(link);
				if (!/^#/.test(link)) {
					request(link, (error) => {
						/**
						* @FIXEDME the link without protocol such as '//example.com' can also cause request error
						*/
						if(error) {
							brokens.push(link);
						}
					});
				}
			}
			return brokens;
		};
		// all <a> tags with 'href'
		$('a[href]').each( (index, element) => {
			let link = element.attribs.href;
			let is_internal = isInternalLinks(domain, link);
			let hostname = getHostname(url);
			let is_internal_source = /^\/(?!\/)/.test(link);
			if (is_internal) {
				if (is_internal_source) {
					// append the hostname to the internal source link
					link = hostname + link;
				}
				internal_links.push(link);
			} else {
				external_links.push(link);
			}
		});
		let internal_broken = getBrokenLinks(internal_links);
		let external_broken = getBrokenLinks(external_links);
		let internal_brokenlinks = internal_broken.length > 0 ? internal_broken.length : null;
		let external_brokenlinks = external_broken.length > 0 ? external_broken.length : null;
		content.push({type: 'Internal links', count: internal_links.length, brokenlinks: internal_brokenlinks});
		content.push({type: 'External links', count: external_links.length, brokenlinks: external_brokenlinks});

		return { heading, content};
	};
	let getLoginForm = () => {
		let heading = 'Login form';
		let found = 'No';
		let foundmessage = 'This page doesn\'t contain a login-form.';
		let isLoginFormFound = () => {
			// detectiing assumptions 
			// search for an input of type password
			// login form has one input of type password
			// signup form has two inpus of type password
			return $('form input[type=password]').length === 1;
		};
		if (isLoginFormFound()) {
			found = 'Yes';
			foundmessage = 'This page contains a login-form.';
		}
		return { heading, found, foundmessage };
	};

	return { getDoctype, getPagetitle, getHeadings, getLinks, getLoginForm };
};