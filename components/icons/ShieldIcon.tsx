import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const ShieldIcon = (props: SvgProps) => (
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
      strokeWidth={1.5}
      d="M9.998 1.667c-2.506 0-4.131 1.682-6.053 2.296-.782.25-1.173.374-1.33.55-.159.175-.205.432-.298.946-.99 5.496 1.175 10.578 6.341 12.556.556.212.833.319 1.343.319s.788-.107 1.343-.32c5.166-1.977 7.33-7.059 6.338-12.555-.092-.514-.139-.77-.297-.947-.158-.175-.549-.3-1.33-.55-1.923-.612-3.55-2.295-6.057-2.295Z"
    />
    <Path
      stroke={props.stroke || "#000"}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M10 5.834v1.667"
    />
  </Svg>
)
export default ShieldIcon
