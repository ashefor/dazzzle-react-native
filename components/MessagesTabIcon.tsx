import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
const MessagesTabIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill={props.focused ? "url(#a)" : "#8E9296"}
      fillRule="evenodd"
      d="M14.9 1.75h-4.3c-4.054 0-6.081 0-7.34 1.264C2 4.278 2 6.313 2 10.382v.54c0 4.068 0 6.102 1.26 7.367.58.583 1.397.972 2.454 1.167.324.06.486.09.557.191.07.102.041.264-.017.588-.14.784-.118 1.494.385 1.87.527.384 1.367-.027 3.047-.849.186-.09.373-.184.56-.278l.003-.001c.997-.499 2.013-1.007 3.097-1.257.472-.108.951-.154 1.554-.167 4.054 0 6.081 0 7.34-1.264 1.26-1.265 1.26-3.299 1.26-7.368v-.54c0-4.068 0-6.103-1.26-7.367C20.982 1.75 18.955 1.75 14.9 1.75Zm2.6 11.75a.75.75 0 0 1-.75.75h-8a.75.75 0 0 1 0-1.5h8a.75.75 0 0 1 .75.75Zm-4-5a.75.75 0 0 1-.75.75h-4a.75.75 0 0 1 0-1.5h4a.75.75 0 0 1 .75.75Z"
      clipRule="evenodd"
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
export default MessagesTabIcon
