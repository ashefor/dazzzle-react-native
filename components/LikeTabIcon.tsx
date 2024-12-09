import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
const LikeTabIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill={props.focused ? "url(#a)" : "#8E9296"}
      d="M4.395 3.355c2.98-1.828 5.655-1.1 7.27.114.266.2.449.336.585.428.135-.092.318-.229.584-.428 1.615-1.214 4.29-1.942 7.27-.114 2.062 1.265 3.221 3.906 2.814 6.94-.409 3.05-2.382 6.498-6.562 9.592-1.451 1.074-2.516 1.863-4.106 1.863-1.59 0-2.656-.789-4.107-1.863-4.18-3.094-6.153-6.543-6.562-9.592-.407-3.034.753-5.675 2.814-6.94Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={12.25}
        x2={12.25}
        y1={2.25}
        y2={21.75}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.207} stopColor="#DD3FE5" />
        <Stop offset={1} stopColor="#3D58F1" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default LikeTabIcon
