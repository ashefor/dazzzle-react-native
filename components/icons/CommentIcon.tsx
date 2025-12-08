import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const CommentIcon = (props: SvgProps) => (
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
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.333 22.5h13.334m-13.334-8.333H20"
    />
    <Path
      stroke={props.stroke || "#000"}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M10.165 31.667c-2.167-.213-3.79-.864-4.88-1.953-1.952-1.952-1.952-5.095-1.952-11.38V17.5c0-6.285 0-9.428 1.953-11.38 1.952-1.953 5.095-1.953 11.38-1.953h6.667c6.286 0 9.428 0 11.381 1.952 1.953 1.953 1.953 5.096 1.953 11.381v.833c0 6.286 0 9.429-1.953 11.381-1.953 1.953-5.095 1.953-11.38 1.953-.935.02-1.679.092-2.41.258-1.997.46-3.846 1.482-5.674 2.373-2.605 1.27-3.907 1.905-4.724 1.31-1.563-1.164-.035-4.771.307-6.441"
    />
  </Svg>
)
export default CommentIcon
