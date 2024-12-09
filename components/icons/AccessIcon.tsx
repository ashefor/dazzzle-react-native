import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const AccessIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <G stroke="#E2E3DD" clipPath="url(#a)">
      <Path
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5.833 1.667A4.167 4.167 0 0 0 3.75 9.443v5.427c0 .68 0 1.022.127 1.328.127.306.368.547.85 1.029l1.106 1.107 1.757-1.757c.081-.081.122-.122.155-.166a.833.833 0 0 0 .164-.396c.008-.055.008-.112.008-.226 0-.093 0-.14-.005-.185a.834.834 0 0 0-.112-.334 1.76 1.76 0 0 0-.106-.15l-1.027-1.37.583-.777c.33-.441.496-.661.581-.918.086-.256.086-.532.086-1.082v-1.53a4.167 4.167 0 0 0-2.083-7.776Z"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.833 5.834h.008"
      />
      <Path
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M10.833 11.667h5c.777 0 1.165 0 1.472.127.408.169.732.493.901.902.127.306.127.694.127 1.471 0 .777 0 1.165-.127 1.471-.169.409-.493.733-.901.902-.307.127-.695.127-1.472.127h-5M12.5 4.167h3.333c.777 0 1.165 0 1.472.127.408.169.732.493.901.902.127.306.127.694.127 1.471 0 .777 0 1.165-.127 1.471-.169.409-.493.733-.901.902-.307.127-.695.127-1.472.127H12.5"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default AccessIcon
