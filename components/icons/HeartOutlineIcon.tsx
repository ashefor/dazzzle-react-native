import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const HeartOutlineIcon = (props: SvgProps) => (
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
      strokeWidth={1.5}
      fill={props.fill || "#fff"}
      d="M32.438 6.657c-4.47-2.742-8.37-1.637-10.714.123-.961.722-1.441 1.082-1.724 1.082-.283 0-.763-.36-1.724-1.082h0c-2.343-1.76-6.244-2.865-10.714-.123C1.697 10.255.37 22.125 13.9 32.139 16.476 34.046 17.765 35 20 35c2.236 0 3.525-.954 6.102-2.861 13.53-10.014 12.202-21.884 6.337-25.482Z"
    />
  </Svg>
)
export default HeartOutlineIcon
