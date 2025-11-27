import Svg, { Path } from "react-native-svg"
import * as React from "react"
const ArrowBackIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#141B34"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 6s-6 4.419-6 6c0 1.581 6 6 6 6"
    />
  </Svg>

  // <FontAwesome6 name="angle-left" size={24} color="" />
)
export default ArrowBackIcon

