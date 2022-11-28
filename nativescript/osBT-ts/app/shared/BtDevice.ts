export type CurrentDevice = BtDevice | null;

export interface Service {
    UUID: string;
    name?: string;
    characteristics?: Characteristic[];
}

export interface Characteristic {
    UUID: string;
    name: string;
    properties?: {
        read: boolean;
        write: boolean;
        writeWithoutResponse: boolean;
        notify: boolean;
        indicate: boolean;
        broadcast: boolean;
        authenticatedSignedWrites: boolean;
        extendedProperties: boolean;
    };
    descriptors?: any;
    permissions?: any;
}

export interface AdvertismentData {
    localName?: string;
    manufacturerData?: ArrayBuffer;
    manufacturerId?: number;
    serviceUUIDs?: string[];
    serviceData?: {
        [k: string]: ArrayBuffer;
    };
    txPowerLevel?: number;
    flags?: number;
}

export class BtDevice {
  description: string;
  index = -1;
  name = "unknown";
  UUID = "unknown";
  state = "disconnected";
  localName?: string;
  RSSI?: number;
  manufacturerId?: number;
  services?: Service[];
  json?: string;
  
  constructor (
    private other?: any
  ) 
  {
    if (this.other) {
      this.name = this.other.name;
      this.UUID = this.other.UUID;
      if (this.other.index)
        this.index = this.other.index;
      if (this.other.description)
        this.description = this.other.description;
      if (this.other.localName)
        this.localName = this.other.localName;
      if (this.other.RSSI)
        this.RSSI = this.other.RSSI;
      if (this.other.manufacturerId)
        this.manufacturerId = this.other.manufacturerId;
      if (this.other.services)
        this.services = this.other.services;
      if (this.other.json)
        this.json = this.other.json;
      if (this.other.state)
        this.state = this.other.state;
    } 
  }
}