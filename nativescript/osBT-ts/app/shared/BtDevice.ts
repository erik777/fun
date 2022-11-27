export type CurrentDevice = BtDevice | null;

export class BtDevice {
  description: string;
  index = -1;
  name = "unknown";
  UUID = "unknown";
  
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
    } 
  }
}