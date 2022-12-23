'use strict';

const { Device } = require('homey');

class GarageDoorDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('Garage Door has been initialized');

    // Init variables
    let device = this;
    let tokens = {};
    let state = {};

    // Handle open/close requests
    this.registerCapabilityListener("garagedoor_closed", async(closed) => {
      this.log("garagedoor_closed - " + closed);
      if (!closed) {
        this.driver.triggerOpenRequestFlow(device, tokens, state);
      }
      else {
        this.driver.triggerCloseRequestFlow(device, tokens, state);
      }

    });

  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('Garage Door has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('Garage Door settings were changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('Garage Door was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('Garage Door has been deleted');
  }

}

module.exports = GarageDoorDevice;
