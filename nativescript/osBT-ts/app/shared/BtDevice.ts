export type CurrentDevice = BtDevice | null;

export class BtDevice {
  name = "unknown";
  
  constructor (
    private other?: any
  ) 
  {
    if (this.other) {
      this.name = this.other.name;
    } 
  }
}