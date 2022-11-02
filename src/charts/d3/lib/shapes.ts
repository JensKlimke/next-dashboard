export type SizeT = {
  width: number
  height: number
}

export type PositionT = {
  x: number
  y: number
}

export type BoxT = PositionT & SizeT & {
  radius?: number
}

export type LabelT = {
  text: string
  x: number
  y: number
  leftToRight: boolean
}
