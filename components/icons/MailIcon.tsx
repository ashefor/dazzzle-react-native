import * as React from "react"
import Svg, { Path } from "react-native-svg"
const MailIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      stroke="#E2E3DD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m5.833 7.084 2.452 1.45c1.43.845 2 .845 3.43 0l2.452-1.45"
    />
    <Path
      stroke="#E2E3DD"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M1.68 11.23c.054 2.555.082 3.832 1.024 4.778.943.946 2.255.98 4.878 1.045 1.617.04 3.219.04 4.836 0 2.623-.066 3.935-.099 4.878-1.045.942-.946.97-2.223 1.024-4.778a57.61 57.61 0 0 0 0-2.46c-.054-2.554-.082-3.831-1.024-4.777-.943-.947-2.255-.98-4.878-1.046a95.923 95.923 0 0 0-4.836 0c-2.623.066-3.935.1-4.878 1.046-.942.946-.97 2.223-1.024 4.778a57.562 57.562 0 0 0 0 2.459Z"
    />
  </Svg>
)
export default MailIcon
