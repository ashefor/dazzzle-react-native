import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const HeartIcon = (props: SvgProps) => (
  <Svg
    width={36}
    height={33}
    viewBox="0 0 36 33"
    fill="none"
    {...props}
  >
    <Path
      fill={props.fill || "#000"}
      d="m17.84 2.43.075.06.074-.06A11.807 11.807 0 0 1 20.642.849c2.31-.988 5.573-1.452 9.293.538 4.638 2.48 6.914 8.42 5.457 14.535-1.473 6.186-6.708 12.557-17.039 16.415l-.438.164-.439-.164C7.146 28.478 1.91 22.107.437 15.921c-1.456-6.116.82-12.054 5.457-14.535 3.72-1.99 6.984-1.526 9.293-.538a11.804 11.804 0 0 1 2.654 1.583Z"
    />
  </Svg>
)
export default HeartIcon
