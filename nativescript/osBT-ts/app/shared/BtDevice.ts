export type CurrentDevice = BtDevice | null;

export class BtDevice {
  name = "unknown";
  UUID = "unknown";
  
  constructor (
    private other?: any
  ) 
  {
    if (this.other) {
      this.name = this.other.name;
      this.UUID = this.other.UUID;
    } 
  }
}