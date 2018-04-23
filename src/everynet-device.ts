﻿import { DeviceEvent, Attr } from './dojot-device';
export interface EveryNetDevice {
  dev_eui: string; /** DevEUI as described in LoRaWAN specification */
  app_eui: string; /** AppEUI as described in LoRaWAN specification */
  app_key: string; /** AppEUI as described in LoRaWAN specification */
  tags?: (null)[] | null;
  activation: "OTAA" | "ABP";  /** Type of activation */
  encryption: "NS" | "APP"; /** Type of encryption */
  dev_addr: string; /** DevAddr as described in LoRaWAN specification */
  nwkskey: string; /** Network Session Key as described in LoRaWAN specification */
  appskey: string; /** Application Session Key as described in LoRaWAN specification */
  /**
   * Device class as described in LoRaWAN specification. 
   * Possible values are: A, C.
   * Class B selected automatically. 
   */
  dev_class: "A" | "B" | "C"; 
  adr: Adr; /** Adaptive data rate object */
  band: string; /** Device band name */

  block_downlink?: boolean; /** If set to ‘true’ Network Server will ignore device’s downlink messages */
  block_uplink?: boolean; /** If set to ‘true’ Network Server will ignore device’s uplink messages */
  counter_down?: number; /** Downlink counter value */
  counter_up?: number; /** Uplink counter value */
  counters_size: 2 | 4; /** Counter size in bytes. Could be 2 or 4. */
  geolocation?: Geolocation; /** Geolocation object */
  last_activity?: number; /** UNIX timestamp of last device activity (last message received) */
  last_join?: number; /** UNIX timestamp of last device join */

  rx1?: RX1; /** 	Params of first RX window */

  /**
   * Enable strict security mode. 
   * Device must have strictly increasing counter.
   */
  strict_counter: boolean; 
  rx2?: RX2; /** Params of second RX window */
}
export function convertDeviceEventToEveryNet(device: DeviceEvent, templateId: string): EveryNetDevice | null {
  // As the device event is generated at runtime, we need to check all its
  // attributes
  let loraAttributes: Attr[] = device.data.attrs[templateId];

  let everynetDevice: any = {};
  for (let attr of loraAttributes) {
    everynetDevice[attr.label] = attr.static_value;
  }

  if (!("dev_eui" in everynetDevice)) { return null; }
  if (!("app_eui" in everynetDevice)) { return null; }
  if (!("app_key" in everynetDevice)) { return null; }
  if (!("activation" in everynetDevice)) { return null; }
  if (!("encryption" in everynetDevice)) { return null; }
  if (!("dev_addr" in everynetDevice)) { return null; }
  if (!("nwkskey" in everynetDevice)) { return null; }
  if (!("appskey" in everynetDevice)) { return null; }
  if (!("dev_class" in everynetDevice)) { return null; }
  if (!("band" in everynetDevice)) { return null; }
  if (!("counters_size" in everynetDevice)) { return null; }
  if (!("strict_counter" in everynetDevice)) { return null; }

  if (!("adr_datarate" in everynetDevice)) { return null; }
  if (!("adr_enabled" in everynetDevice)) { return null; }
  if (!("adr_mode" in everynetDevice)) { return null; }
  if (!("adr_tx_power" in everynetDevice)) { return null; }


  // Converting structures
  everynetDevice["adr"] = {
    "datarate": everynetDevice["adr_datarate"],
    "enabled": everynetDevice["adr_enabled"],
    "mode" : everynetDevice["adr_mode"],
    "tx_power": everynetDevice["adr_tx_power"]
  }

  delete everynetDevice["adr_datarate"];
  delete everynetDevice["adr_enabled"];
  delete everynetDevice["adr_mode"];
  delete everynetDevice["adr_tx_power"];

  if ("geolocation.lat" in everynetDevice) {
    everynetDevice["geolocation"] = {
      "lat": everynetDevice["geolocation_lat"],
      "lng": everynetDevice["geolocation_lng"],
      "precision": everynetDevice["geolocation_precision"]
    }

    delete everynetDevice["geolocation_lat"];
    delete everynetDevice["geolocation_lng"];
    delete everynetDevice["geolocation_precision"];
  }

  if ("rx1_delay" in everynetDevice) {
    everynetDevice["rx1"] = {
      "delay": everynetDevice["rx1_delay"],
      "status": everynetDevice["rx1_status"],
      "current_delay": everynetDevice["rx1_current_delay"],
    }

    delete everynetDevice["rx1_delay"];
    delete everynetDevice["rx1_status"];
    delete everynetDevice["rx1_current_delay"];
  }

  if ("rx2_force" in everynetDevice) {
    everynetDevice["rx2"] = { "force": everynetDevice["rx2_force"]};
    delete everynetDevice["rx2_force"];
  }
  
  return everynetDevice;
}



export interface Geolocation {
  lat: number; /** Latitude */
  lng: number; /** Longitude */
  precision: number;
}

export interface RX1 {
  delay: number; /** RX1 delay */
  status: "processing" | "pending" | "set"; /** Current status */
  current_delay: number; /** Current RX1 delay */
}

export interface RX2 {
  /**
   * if set to ‘true’ Network Server will send downlink messages in second RX window
   */
  force: boolean;
}

export interface Adr {
  datarate: null | number; /** Currently datarate */
  enabled: boolean; /** Device ADR status */
  mode: "on" | "off" | "static"; /** ADR mode */
  tx_power: number | null; /** TX power */
}