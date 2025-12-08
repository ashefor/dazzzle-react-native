import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const EllipsisIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M11.992 12h.009M11.984 18h.01M12 6h.009"
    />
  </Svg>
)
export default EllipsisIcon
