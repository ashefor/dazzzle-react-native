import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const LocationIcon = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <Path
      stroke={props.stroke || "#fff"}
      strokeWidth={1.5}
      d="M12.917 9.167a2.917 2.917 0 1 1-5.834 0 2.917 2.917 0 0 1 5.834 0Z"
    />
    <Path
      stroke={props.stroke || "#fff"}
      strokeWidth={1.5}
      d="M10 1.667c4.059 0 7.5 3.36 7.5 7.438 0 4.142-3.497 7.049-6.727 9.026a1.572 1.572 0 0 1-1.546 0C6.003 16.135 2.5 13.26 2.5 9.105c0-4.077 3.441-7.438 7.5-7.438Z"
    />
  </Svg>
)
export default LocationIcon
