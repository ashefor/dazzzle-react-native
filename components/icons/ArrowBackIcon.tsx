import * as React from "react"
import Svg, { Path } from "react-native-svg"
const ArrowBackIcon = (props: any) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={8}
    height={14}
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7 1S1 5.419 1 7c0 1.581 6 6 6 6"
    />
  </Svg>
)
export default ArrowBackIcon
