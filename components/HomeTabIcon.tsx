import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
const HomeTabIcon = (props: any) => (
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
      d="M10.274 1.996c.836-.47 1.61-.746 2.476-.746.866 0 1.64.277 2.476.746.81.454 1.738 1.125 2.905 1.97l1.51 1.09c.936.677 1.684 1.218 2.248 1.719.582.517 1.018 1.032 1.295 1.68.277.65.344 1.315.307 2.083-.036.74-.174 1.635-.345 2.75l-.315 2.05c-.244 1.585-.437 2.846-.722 3.828-.294 1.016-.71 1.823-1.45 2.44-.739.613-1.618.887-2.692 1.017-1.045.127-2.363.127-4.028.127H11.56c-1.665 0-2.983 0-4.028-.127-1.074-.13-1.953-.404-2.692-1.018-.74-.616-1.156-1.423-1.45-2.439-.285-.982-.478-2.244-.722-3.827l-.315-2.052c-.171-1.114-.309-2.008-.345-2.749-.037-.768.03-1.433.307-2.083.277-.648.713-1.163 1.295-1.68.564-.5 1.312-1.042 2.249-1.719l1.509-1.09c1.167-.845 2.095-1.516 2.905-1.97ZM10.75 17a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-4Z"
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
export default HomeTabIcon
