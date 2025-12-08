import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

type Props = SvgProps & {
    focused: boolean
}
const ProfileTabIcon = (props: Props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      fill={props.focused ? "#DD3FE5" : "#8E9296"}
      d="M17.806 14.837c.116.07.26.15.422.242.713.402 1.79 1.01 2.529 1.733.462.452.9 1.047.98 1.777.085.776-.254 1.504-.933 2.15-1.171 1.117-2.577 2.011-4.395 2.011H7.59c-1.819 0-3.225-.894-4.396-2.01-.679-.647-1.017-1.375-.933-2.151.08-.73.519-1.325.98-1.777.739-.723 1.816-1.33 2.529-1.733.163-.091.306-.173.423-.242a11.413 11.413 0 0 1 11.612 0ZM6.75 6.5a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z"
    />
  </Svg>
)
export default ProfileTabIcon
