import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const LockIcon = (props: SvgProps) => (
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
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.66 12.5h.007m-3.334 0h.006"
    />
    <Path
      stroke={props.stroke || "#000"}
      strokeWidth={1.5}
      d="M4.167 12.5a5.833 5.833 0 1 1 11.666 0 5.833 5.833 0 0 1-11.666 0Z"
    />
    <Path
      stroke={props.stroke || "#000"}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M13.75 7.916v-2.5a3.75 3.75 0 1 0-7.5 0v2.5"
    />
  </Svg>
)
export default LockIcon
