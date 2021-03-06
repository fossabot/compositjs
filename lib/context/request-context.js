"use strict";

const url = require('url');
const querystring = require('querystring');
const { Context } = require('@loopback/context');
const { bindHeadersToContext } = require('./utils');

class RequestContext extends Context {

  constructor(request, response) {

    super();

    this.req = request;
    this.res = response;

    this._populateHeaderVariables();
    this._populateRequestVariables();
  }

  _populateHeaderVariables() {

    // If no x-request-id header available then setting context UUID as x-request-id
    if(this.req && this.req.headers && !this.req.headers['x-request-id']) {
      this.req.headers['x-request-id'] = this.name;
    }

    // Biniding request headers to this requestcontext with the prefix of `request`
    bindHeadersToContext(this.req.headers, this, 'request');
  }

  _populateRequestVariables() {

    // The HTTP verb of this request.
    this.bind('request.method').to(this.req.method.toLowerCase());

    // The full HTTP request URI from the application.
    this.bind('request.uri').to(`${this.req.protocol}://${this.req.get('host')}${this.req.originalUrl}`);

    var urlParsed = url.parse(this.req.url, false);

    this.bind('request.path').to(urlParsed.pathname);
    this.bind('request.search').to(urlParsed.search || '');
    this.bind('request.querystring').to(urlParsed.query || '');
    this.bind('request.query').to(querystring.decode(urlParsed.query) || {});
    
    const query = (querystring.decode(urlParsed.query) || {});
    for (var key in query) this.bind(`request.query.${key}`).to(query[key]);
    
    this.bind('request.content-type').to(this.req.get('content-type') || '');
    this.bind('request.date').to(new Date());
    this.bind('request.body').to(this.req.body || new Buffer(0));   
  }
}

module.exports = RequestContext;
