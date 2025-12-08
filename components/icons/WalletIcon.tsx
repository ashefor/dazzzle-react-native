import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const WalletIcon = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <Path
      stroke={props.stroke || "#000"}
      strokeWidth={1.5}
      d="M12.5 12.5a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0Z"
    />
    <Path
      stroke={props.stroke || "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12.503 6.502C7.98 6.19 4.253 5.518 2.5 5v7.551c0 1.662 0 2.493.516 3.171.517.678 1.225.87 2.642 1.252 2.289.618 4.695.987 6.85 1.198 2.235.218 3.352.327 4.172-.422.82-.75.82-1.953.82-4.36v-1.678c0-2.337 0-3.506-.673-4.231-.672-.726-1.89-.81-4.324-.979Z"
    />
    <Path
      stroke={props.stroke || "#000"}
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14.688 6.667c.315-1.187.6-3.344-.249-4.415-.538-.679-1.337-.613-2.12-.544-4.12.362-7.031 1.098-8.658 1.598-.7.215-1.161.898-1.161 1.66"
    />
  </Svg>
)
export default WalletIcon
