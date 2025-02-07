import * as React from "react"
import Svg, { Path } from "react-native-svg"
const ArrowBackIcon = (props: any) => (
  // <Svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   width={8}
  //   height={14}
  //   fill="none"
  //   {...props}
  // >
  //   <Path
  //     stroke="#fff"
  //     strokeLinecap="round"
  //     strokeLinejoin="round"
  //     strokeWidth={1.5}
  //     d="M7 1S1 5.419 1 7c0 1.581 6 6 6 6"
  //   />
  // </Svg>
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="#fff"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
    />
  </Svg>
)
export default ArrowBackIcon

