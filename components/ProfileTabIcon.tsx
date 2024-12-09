import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
const ProfileTabIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill={props.focused ? "url(#a)" : "#8E9296"}
      d="M18.056 14.837c.116.07.26.15.423.242.713.402 1.79 1.01 2.528 1.733.462.452.9 1.047.98 1.777.085.776-.253 1.504-.932 2.15-1.172 1.117-2.578 2.011-4.396 2.011H7.841c-1.819 0-3.224-.894-4.396-2.01-.679-.647-1.017-1.375-.932-2.151.08-.73.518-1.325.98-1.777.738-.723 1.815-1.33 2.528-1.733.163-.091.306-.173.423-.242a11.413 11.413 0 0 1 11.612 0ZM7 6.5a5.25 5.25 0 1 1 10.5 0A5.25 5.25 0 0 1 7 6.5Z"
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
export default ProfileTabIcon
