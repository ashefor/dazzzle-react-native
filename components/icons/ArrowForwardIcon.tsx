import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const ArrowForwardIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      stroke={props.stroke || "#8E8E93"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 18s6-4.419 6-6c0-1.581-6-6-6-6"
    />
  </Svg>
)
export default ArrowForwardIcon
