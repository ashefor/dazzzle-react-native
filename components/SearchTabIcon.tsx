import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
const SearchTabIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="size-6"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke={props.focused ? "url(#a)" : "#8E9296"}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
    <Defs>
          <LinearGradient
            id="a"
            x1={12.75}
            x2={12.75}
            y1={1.25}
            y2={22.75}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset={0.207} stopColor="#DD3FE5" />
            <Stop offset={1} stopColor="#3D58F1" />
          </LinearGradient>
        </Defs>
  </Svg>
)
export default SearchTabIcon
