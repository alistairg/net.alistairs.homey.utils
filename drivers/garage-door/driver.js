'use strict';

const { Driver } = require('homey');

class GarageDoorDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('Garage Door Driver driver has been initialized');
    this._deviceOpenRequested = this.homey.flow.getDeviceTriggerCard("door_open_request");
    this._deviceCloseRequested = this.homey.flow.getDeviceTriggerCard("door_close_request");
    this._obtructionUpdateFlowCard = this.homey.flow.getActionCard("update_obstructed");
    this._doorStateUpdateFlowCard = this.homey.flow.getActionCard("update_door_state");

    this.registerObstructionAction();
    this.registerDoorStateAction();
  }

  // Handler for an open request
  triggerOpenRequestFlow(device, tokens, state) {
    this._deviceOpenRequested
      .trigger(device, tokens, state)
      .then(this.log)
      .catch(this.error)
  }

  // Handler for a close request
  triggerCloseRequestFlow(device, tokens, state) {
    this._deviceCloseRequested
      .trigger(device, tokens, state)
      .then(this.log)
      .catch(this.error)
  }

  // Register for obstruction flow card action
  registerObstructionAction() {
    this._obtructionUpdateFlowCard.registerRunListener((args, state) => {
      this.log("Obstruction update - " + simpleStringify(args));
      let device = args.device;
      let obstructed = args.obstructed;
      return device.setCapabilityValue("alarm_obstructed", (obstructed == "obstructed"))
    })
  }

  // Register for door state update flow card action
  registerDoorStateAction() {
    this._doorStateUpdateFlowCard.registerRunListener((args, state) => {
      this.log("Door state update - " + simpleStringify(args));
      let device = args.device;
      let new_state = args.new_state;
      return device.setCapabilityValue("garage_door_state", new_state)
    })
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    this.log("Returning pairable devices...");
    return [
      {
        name: 'Garage Door',
        data: {
          id: 'garage-door'
        }
      }
    ];
  }

}

function simpleStringify (object) {
  var simpleObject = cleanJson(object);
  return JSON.stringify(simpleObject);
};

function cleanJson (object){
var simpleObject = {};
for (var prop in object ){
    if (!object.hasOwnProperty(prop)){
        continue;
    }
    if (typeof(object[prop]) == 'object'){
        continue;
    }
    if (typeof(object[prop]) == 'function'){
        continue;
    }
    simpleObject[prop] = object[prop];
}
return simpleObject; // returns cleaned up Object
};

module.exports = GarageDoorDriver;
