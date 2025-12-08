import * as React from "react"
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg"
const UserBlockIcon = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <G stroke={props.stroke || "#000"} strokeWidth={1.5} clipPath="url(#a)">
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.833 18.333h-5.34c-1.288 0-2.313-.627-3.232-1.503-1.883-1.794 1.208-3.227 2.387-3.93 2-1.19 4.388-1.52 6.602-.988"
      />
      <Path d="M13.75 5.416a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      <Path
        strokeLinecap="round"
        d="m13.375 13.375 4.083 4.083m.875-2.041a2.917 2.917 0 1 0-5.833 0 2.917 2.917 0 0 0 5.833 0Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default UserBlockIcon
