import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

type Props = SvgProps & {
    focused: boolean
}
const LikeTabIcon = (props: Props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      fill={props.focused ? "#DD3FE5" : "#8E9296"}
      d="M4.145 3.355c2.98-1.828 5.655-1.1 7.27.114.266.2.449.336.585.428.135-.092.318-.229.584-.428 1.615-1.214 4.29-1.942 7.27-.114 2.062 1.265 3.221 3.906 2.814 6.94-.409 3.05-2.382 6.498-6.562 9.592C14.655 20.96 13.59 21.75 12 21.75c-1.59 0-2.656-.789-4.107-1.863-4.18-3.094-6.153-6.543-6.562-9.592-.407-3.034.753-5.675 2.814-6.94Z"
    />
  </Svg>
)
export default LikeTabIcon
