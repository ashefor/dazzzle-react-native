import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const ExitIcon = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <Path
      stroke={props.stroke || "#8E8E93"}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M12.5 14.688c-.061 1.543-1.347 2.853-3.07 2.811-.401-.01-.897-.15-1.887-.429-2.385-.673-4.455-1.803-4.952-4.335-.091-.466-.091-.99-.091-2.037V9.302c0-1.047 0-1.571.091-2.037.497-2.532 2.567-3.662 4.952-4.335.99-.28 1.486-.42 1.887-.429 1.723-.042 3.009 1.268 3.07 2.812"
    />
    <Path
      stroke={props.stroke || "#8E8E93"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.5 10H8.333m9.167 0c0-.583-1.662-1.673-2.083-2.083M17.5 10c0 .584-1.662 1.674-2.083 2.084"
    />
  </Svg>
)
export default ExitIcon
