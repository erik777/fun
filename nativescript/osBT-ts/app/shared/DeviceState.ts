export class DeviceState {
  public lightSwitch?: number;  // 0 = off, 1 = on
  public brightness?: number;   // 0 - 255
  public error?: string;

  haveLightSwitch(): boolean {
    return this.lightSwitch !== undefined;
  }

  isLightOn(): boolean {
    return this.haveLightSwitch() && this.lightSwitch === 1;
  }

  haveBrightness(): boolean {
    return this.brightness !== undefined;
  }

  clear(): void {
    this.lightSwitch = undefined;
    this.brightness = undefined;
    this.error = undefined;
  }
}
