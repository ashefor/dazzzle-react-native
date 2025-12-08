import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const HeartbreakIcon = (props: SvgProps) => (
  <Svg
    width={40}
    height={40}
    viewBox="0 0 40 40"
    fill="none"
    {...props}
  >
    <Path
      stroke={props.stroke || "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      fill={props.fill || "#fff"}
      d="M17.35 33.28c-4.7-3.517-14.017-11.555-14.017-18.79 0-4.78 3.509-8.657 8.334-8.657 2.5 0 5 .834 8.333 4.167 3.333-3.333 5.833-4.167 8.333-4.167 4.825 0 8.334 3.877 8.334 8.657 0 7.233-9.317 15.273-14.017 18.79a4.4 4.4 0 0 1-5.3 0Z"
    />
    <Path
      stroke={props.stroke || "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      fill={props.fill || "#fff"}
      d="M20 9.998 23.333 15l-4.166 5 3.333 3.333-1.667 3.334"
    />
  </Svg>
)
export default HeartbreakIcon
