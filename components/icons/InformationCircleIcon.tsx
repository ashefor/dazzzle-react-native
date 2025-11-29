import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const InformationCircleIcon = (props: SvgProps) => (
  <Svg
    width={48}
    height={48}
    viewBox="0 0 48 48"
    fill="none"
    {...props}
  >
    <Path
      fill="#141B34"
      fillRule="evenodd"
      d="M24 45.5C12.126 45.5 2.5 35.874 2.5 24S12.126 2.5 24 2.5 45.5 12.126 45.5 24 35.874 45.5 24 45.5ZM22 13v3h4v-3h-4Zm-2 9h2v12h4V18h-6v4Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default InformationCircleIcon
