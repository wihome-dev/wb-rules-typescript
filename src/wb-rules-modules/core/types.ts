export interface DeviceContext {
  get id(): string
  get isReady(): boolean
}

export type TrackFunc = (
  controlId: string,
  callback: (newValue: MqttValue) => void
) => void

export interface PluginContext {
  device: DeviceContext
  track: TrackFunc
}

export type DevicePlugin<TPlugin = unknown>
  = (context: PluginContext) => TPlugin
