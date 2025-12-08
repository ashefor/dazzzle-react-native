import * as React from "react"
import Svg, { SvgProps, Path, Rect } from "react-native-svg"
const IdCardIcon = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <Path
      stroke={props.stroke || "#000"}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M11.667 7.5H15M11.667 10.416h2.5"
    />
    <Rect
      width={16.667}
      height={15}
      x={1.667}
      y={2.5}
      stroke={props.stroke || "#000"}
      strokeLinejoin="round"
      strokeWidth={1.5}
      rx={5}
    />
    <Path
      stroke={props.stroke || "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4.167 13.333c1.007-2.15 4.76-2.292 5.833 0"
    />
    <Path
      stroke={props.stroke || "#000"}
      strokeWidth={1.5}
      d="M8.75 7.5a1.667 1.667 0 1 1-3.333 0 1.667 1.667 0 0 1 3.333 0Z"
    />
  </Svg>
)
export default IdCardIcon
