"use strict";

const RestserviceController = require('./rest-service.controller');
const debug = require('debug')('compositjs:service');

class Service {

  constructor(spec = {}) {

    this.spec = spec;
    this.response = null;
    
    debug('Service name:', this.spec.info.name);
    debug('Service type:', this.spec.service.type);

    if(this.spec.service.type === 'rest') {
      this._service = new RestserviceController(this.spec);
    } else{
      throw new Error(`Service (${this.spec.info.name || ""}) specification not correct. Debug for more details.`);
    }
  }

  /**
   * Service execution will invoke the services registered.
   * 
   * @param {Object} context 
   */
  async execute(context) {

    return await this._service.invoke(context);    
  }
}

module.exports = Service;