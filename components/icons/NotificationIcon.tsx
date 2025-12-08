import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const NotificationIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      fill={props.color}
      d="m21.5 16 .489.569a.75.75 0 0 0 .162-.941L21.5 16Zm-19 0-.651-.372a.75.75 0 0 0 .162.94L2.5 16Zm17-3.5h-.75v.2l.099.172.651-.372Zm-15 0 .651.372.099-.173V12.5H4.5ZM12 19v.75c4.051 0 7.709-1.22 9.989-3.181L21.5 16l-.489-.569C19.068 17.101 15.79 18.25 12 18.25V19Zm-9.5-3-.489.569c2.28 1.96 5.938 3.181 9.989 3.181v-1.5c-3.79 0-7.068-1.148-9.011-2.819L2.5 16Zm19 0 .651-.372-2-3.5-.651.372-.651.372 2 3.5L21.5 16Zm-2-3.5h.75v-3h-1.5v3h.75Zm-15-3h-.75v3h1.5v-3H4.5Zm0 3-.651-.372-2 3.5L2.5 16l.651.372 2-3.5L4.5 12.5ZM12 2v-.75A8.25 8.25 0 0 0 3.75 9.5h1.5A6.75 6.75 0 0 1 12 2.75V2Zm7.5 7.5h.75A8.25 8.25 0 0 0 12 1.25v1.5a6.75 6.75 0 0 1 6.75 6.75h.75Z"
    />
    <Path
      stroke={props.color}
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 18a4 4 0 0 1-8 0"
    />
  </Svg>
)
export default NotificationIcon
