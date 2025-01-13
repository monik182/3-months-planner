// FIXME: will this be the final enums?
export enum Status {
  INACTIVE = '0',
  ACTIVE = '1',
  DELETED = '2',
}

export interface Step<T> {
  goNext?: () => void
  onChange?: (value: T) => void
}

export interface Vision {
  content: string
}

export interface SegmentData {
  params: Promise<{
    id: string
  }>
}
