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

export const DISCONNECTED = "disconnected";
export const DISCONNECTING = "disconnecting";
export const CONNECTED = "connected";
export const CONNECTING = "connecting";
export const READING = "reading";
export const READ = "done reading";
export const READ_ERROR = "reading error";
export const WRITING = "writing";
export const WROTE = "done writing";
export const WRITE_ERROR = "writing error";

export class BtDevice {
  description: string;
  index = -1;
  name = "unknown";
  UUID = "unknown";
  state = DISCONNECTED;
  localName?: string;
  RSSI?: number;
  manufacturerId?: number;
  services?: Service[];
  serviceCount = 0;
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

  connected(): BtDevice {
    this.state = CONNECTED;
    return this;
  }

  connecting(): BtDevice {
    this.state = CONNECTING;
    return this;
  }

  disconnected(): BtDevice {
    this.state = DISCONNECTED;
    return this;
  }

  disconnecting(): BtDevice {
    this.state = DISCONNECTING;
    return this;
  }

  doneReading(): BtDevice {
    this.state = READ;
    return this;
  }

  doneReadingError(): BtDevice {
    this.state = READ_ERROR;
    return this;
  }

  reading(): BtDevice {
    this.state = READING;
    return this;
  }

  doneWriting(): BtDevice {
    this.state = WROTE;
    return this;
  }

  doneWritingError(): BtDevice {
    this.state = WRITE_ERROR;
    return this;
  }

  writing(): BtDevice {
    this.state = WRITING;
    return this;
  }

  isConnected(): boolean {
    return this.state === CONNECTED || this.state === READING
    || this.state === READ || this.state === READ_ERROR;
  }

  isConnecting(): boolean {
    return this.state === CONNECTING;
  }

  isValid(): boolean {
    return this.index > -1;
  }

  clear(): void {
    this.index = -1;
  }
}
