export class DeviceState {
  lightSwitch?: number;
  brightness?: number;
  error?: string;

  haveLightSwitch(): boolean {
    return this.lightSwitch !== undefined;
  }
}
