'use client';

import { memo } from 'react';

interface AnimatedUnicornProps {
  scrollProgress: number;
  size?: number;
}

const AnimatedUnicorn = memo(function AnimatedUnicorn({
  scrollProgress,
  size = 50
}: AnimatedUnicornProps) {
  // Galloping cycle calculation - 12 cycles per full page scroll for rapid gallop
  const cycleProgress = (scrollProgress * 12) % 1;
  const phase = cycleProgress * Math.PI * 2;

  // Gallop pattern: diagonal legs move together
  // Front-left and back-right move together
  // Front-right and back-left move together (opposite phase)

  const frontLeftAngle = Math.sin(phase) * 55;
  const backRightAngle = Math.sin(phase) * 50; // Same phase as front-left

  const frontRightAngle = Math.sin(phase + Math.PI) * 55; // Opposite phase
  const backLeftAngle = Math.sin(phase + Math.PI) * 50; // Opposite phase

  return (
    <svg
      width={size}
      height={size}
      viewBox="-20 -20 420 380"
      fill="none"
      style={{
        opacity: 0.1,
        flexShrink: 0,
      }}
    >
      {/* Body elements (non-legs) - main unicorn body, head, horn, etc. */}
      <rect x="9" y="89" width="6" height="6" transform="rotate(-90 9 89)" fill="black"/>
      <rect x="9" y="83" width="6" height="6" transform="rotate(-90 9 83)" fill="black"/>
      <rect x="9" y="77" width="6" height="6" transform="rotate(-90 9 77)" fill="black"/>
      <rect x="9" y="71" width="6" height="6" transform="rotate(-90 9 71)" fill="black"/>
      <rect x="32" y="75" width="6" height="6" transform="rotate(-90 32 75)" fill="black"/>
      <rect x="32" y="75" width="6" height="6" transform="rotate(-90 32 75)" fill="black"/>
      <rect x="26" y="81" width="6" height="6" transform="rotate(-90 26 81)" fill="black"/>
      <rect x="32" y="81" width="6" height="6" transform="rotate(-90 32 81)" fill="black"/>
      <rect x="32" y="69" width="6" height="6" transform="rotate(-90 32 69)" fill="black"/>
      <rect x="32" y="63" width="6" height="6" transform="rotate(-90 32 63)" fill="black"/>
      <rect x="26" y="123" width="3" height="3" transform="rotate(-180 26 123)" fill="black"/>
      <rect x="18" y="111" width="3" height="3" transform="rotate(-180 18 111)" fill="black"/>

      {/* Back-left leg */}
      <g
        style={{
          transformOrigin: '65px 210px',
          transform: `rotate(${backLeftAngle}deg)`,
          willChange: 'transform',
        }}
      >
        <path d="M56 232L56 238L53 238L53 232L56 232Z" fill="black"/>
        <path d="M56 238L56 244L53 244L53 238L56 238Z" fill="black"/>
        <rect x="56" y="244" width="6" height="6" transform="rotate(-90 56 244)" fill="black"/>
        <rect x="56" y="238" width="6" height="6" transform="rotate(-90 56 238)" fill="black"/>
        <path d="M65 235L65 241L62 241L62 235L65 235Z" fill="black"/>
        <rect x="65" y="241" width="6" height="6" transform="rotate(-90 65 241)" fill="black"/>
        <path d="M65 223L65 229L62 229L62 223L65 223Z" fill="black"/>
        <rect x="65" y="229" width="6" height="6" transform="rotate(-90 65 229)" fill="black"/>
        <path d="M74 226L74 232L71 232L71 226L74 226Z" fill="black"/>
        <rect x="74" y="232" width="6" height="6" transform="rotate(-90 74 232)" fill="black"/>
        <path d="M74 220L74 226L71 226L71 220L74 220Z" fill="black"/>
        <rect x="74" y="226" width="6" height="6" transform="rotate(-90 74 226)" fill="black"/>
        <path d="M65 229L65 235L62 235L62 229L65 229Z" fill="black"/>
        <rect x="65" y="235" width="6" height="6" transform="rotate(-90 65 235)" fill="black"/>
      </g>

      {/* Back-right leg */}
      <g
        style={{
          transformOrigin: '130px 190px',
          transform: `rotate(${backRightAngle}deg)`,
          willChange: 'transform',
        }}
      >
        <path d="M119 184L119 190L116 190L116 184L119 184Z" fill="black"/>
        <path d="M119 190L119 196L116 196L116 190L119 190Z" fill="black"/>
        <path d="M119 196L119 202L116 202L116 196L119 196Z" fill="black"/>
        <path d="M117 202L117 208L114 208L114 202L117 202Z" fill="black"/>
        <path d="M114 202L114 208L111 208L111 202L114 202Z" fill="black"/>
        <path d="M111 202L111 208L108 208L108 202L111 202Z" fill="black"/>
        <path d="M129 205L129 211L126 211L126 205L129 205Z" fill="black"/>
        <path d="M129 211L129 217L126 217L126 211L129 211Z" fill="black"/>
        <path d="M129 217L129 223L126 223L126 217L129 217Z" fill="black"/>
        <path d="M129 223L129 229L126 229L126 223L129 223Z" fill="black"/>
        <path d="M135 229L129 229L129 226L135 226L135 229Z" fill="black"/>
        <path d="M141 229L135 229L135 226L141 226L141 229Z" fill="black"/>
        <path d="M147 217L147 223L144 223L144 217L147 217Z" fill="black"/>
        <path d="M150 217L150 223L147 223L147 217L150 217Z" fill="black"/>
        <path d="M150 211L150 217L147 217L147 211L150 211Z" fill="black"/>
        <path d="M150 206L150 212L147 212L147 206L150 206Z" fill="black"/>
        <path d="M144 217L144 223L141 223L141 217L144 217Z" fill="black"/>
        <path d="M141 217L141 223L138 223L138 217L141 217Z" fill="black"/>
      </g>

      {/* Front-left leg */}
      <g
        style={{
          transformOrigin: '245px 250px',
          transform: `rotate(${frontLeftAngle}deg)`,
          willChange: 'transform',
        }}
      >
        <rect x="257" y="303" width="6" height="6" fill="black"/>
        <rect x="251" y="303" width="6" height="6" fill="black"/>
        <rect x="257" y="309" width="6" height="6" fill="black"/>
        <rect x="251" y="309" width="6" height="6" fill="black"/>
        <rect x="257" y="315" width="6" height="6" fill="black"/>
        <rect x="251" y="315" width="6" height="6" fill="black"/>
        <rect x="257" y="321" width="6" height="6" fill="black"/>
        <rect x="245" y="303" width="6" height="6" fill="black"/>
        <rect x="245" y="291" width="6" height="6" transform="rotate(-90 245 291)" fill="black"/>
        <rect x="245" y="285" width="6" height="6" transform="rotate(-90 245 285)" fill="black"/>
        <rect x="245" y="297" width="6" height="6" transform="rotate(-90 245 297)" fill="black"/>
        <rect x="245" y="303" width="6" height="6" transform="rotate(-90 245 303)" fill="black"/>
        <rect x="254" y="269" width="6" height="3" transform="rotate(-90 254 269)" fill="black"/>
        <rect x="257" y="269" width="6" height="6" transform="rotate(-90 257 269)" fill="black"/>
        <rect x="254" y="263" width="6" height="3" transform="rotate(-90 254 263)" fill="black"/>
        <rect x="257" y="263" width="6" height="6" transform="rotate(-90 257 263)" fill="black"/>
        <rect x="254" y="257" width="6" height="3" transform="rotate(-90 254 257)" fill="black"/>
        <rect x="257" y="257" width="6" height="6" transform="rotate(-90 257 257)" fill="black"/>
        <rect x="246" y="251" width="6" height="3" transform="rotate(-90 246 251)" fill="black"/>
        <rect x="249" y="251" width="6" height="6" transform="rotate(-90 249 251)" fill="black"/>
        <rect x="246" y="245" width="6" height="3" transform="rotate(-90 246 245)" fill="black"/>
        <rect x="249" y="245" width="6" height="6" transform="rotate(-90 249 245)" fill="black"/>
        <rect x="237" y="243" width="6" height="3" transform="rotate(-90 237 243)" fill="black"/>
        <rect x="240" y="243" width="6" height="6" transform="rotate(-90 240 243)" fill="black"/>
        <rect x="237" y="237" width="6" height="3" transform="rotate(-90 237 237)" fill="black"/>
        <rect x="240" y="237" width="6" height="6" transform="rotate(-90 240 237)" fill="black"/>
        <rect x="237" y="231" width="6" height="3" transform="rotate(-90 237 231)" fill="black"/>
        <rect x="240" y="231" width="6" height="6" transform="rotate(-90 240 231)" fill="black"/>
        <rect x="228" y="225" width="6" height="3" transform="rotate(-90 228 225)" fill="black"/>
        <rect x="231" y="225" width="6" height="6" transform="rotate(-90 231 225)" fill="black"/>
        <rect x="228" y="219" width="6" height="3" transform="rotate(-90 228 219)" fill="black"/>
        <rect x="231" y="219" width="6" height="6" transform="rotate(-90 231 219)" fill="black"/>
        <rect x="242" y="297" width="6" height="3" transform="rotate(-90 242 297)" fill="black"/>
        <rect x="242" y="291" width="6" height="3" transform="rotate(-90 242 291)" fill="black"/>
        <rect x="242" y="285" width="6" height="3" transform="rotate(-90 242 285)" fill="black"/>
        <rect x="236" y="285" width="6" height="6" transform="rotate(-90 236 285)" fill="black"/>
        <rect x="233" y="285" width="6" height="3" transform="rotate(-90 233 285)" fill="black"/>
        <rect x="242" y="303" width="6" height="3" transform="rotate(-90 242 303)" fill="black"/>
        <rect x="242" y="309" width="6" height="3" transform="rotate(-90 242 309)" fill="black"/>
        <rect x="248" y="309" width="3" height="3" fill="black"/>
        <rect x="242" y="309" width="3" height="3" fill="black"/>
        <rect x="245" y="309" width="3" height="3" fill="black"/>
      </g>

      {/* Front-right leg */}
      <g
        style={{
          transformOrigin: '275px 270px',
          transform: `rotate(${frontRightAngle}deg)`,
          willChange: 'transform',
        }}
      >
        <rect x="263" y="321" width="6" height="6" fill="black"/>
        <rect x="269" y="321" width="6" height="6" fill="black"/>
        <rect x="266" y="284" width="6" height="6" transform="rotate(-90 266 284)" fill="black"/>
        <rect x="266" y="290" width="6" height="6" transform="rotate(-90 266 290)" fill="black"/>
        <rect x="266" y="296" width="6" height="6" transform="rotate(-90 266 296)" fill="black"/>
        <rect x="272" y="297" width="6" height="6" transform="rotate(-90 272 297)" fill="black"/>
        <path d="M278 297L278 291L281 291L281 297L278 297Z" fill="black"/>
        <rect x="263" y="296" width="6" height="3" transform="rotate(-90 263 296)" fill="black"/>
        <rect x="263" y="290" width="6" height="3" transform="rotate(-90 263 290)" fill="black"/>
        <rect x="263" y="284" width="6" height="3" transform="rotate(-90 263 284)" fill="black"/>
        <rect x="265" y="278" width="6" height="6" transform="rotate(-90 265 278)" fill="black"/>
        <rect x="266" y="278" width="6" height="6" transform="rotate(-90 266 278)" fill="black"/>
        <rect x="263" y="278" width="6" height="3" transform="rotate(-90 263 278)" fill="black"/>
        <rect x="269" y="269" width="3" height="3" fill="black"/>
        <rect x="266" y="269" width="3" height="3" fill="black"/>
        <rect x="263" y="269" width="3" height="3" fill="black"/>
        <path d="M278 303L278 297L281 297L281 303L278 303Z" fill="black"/>
        <path d="M278 309L278 303L281 303L281 309L278 309Z" fill="black"/>
        <rect x="281" y="315" width="6" height="3" transform="rotate(-90 281 315)" fill="black"/>
        <rect x="281" y="321" width="6" height="3" transform="rotate(-90 281 321)" fill="black"/>
        <path d="M278 315L278 309L281 309L281 315L278 315Z" fill="black"/>
        <rect x="281" y="303" width="6" height="3" transform="rotate(-90 281 303)" fill="black"/>
        <rect x="281" y="309" width="6" height="3" transform="rotate(-90 281 309)" fill="black"/>
        <rect x="272" y="303" width="6" height="6" transform="rotate(-90 272 303)" fill="black"/>
        <rect x="272" y="309" width="6" height="6" transform="rotate(-90 272 309)" fill="black"/>
        <rect x="272" y="315" width="6" height="6" transform="rotate(-90 272 315)" fill="black"/>
        <rect x="269" y="321" width="6" height="6" transform="rotate(-90 269 321)" fill="black"/>
        <rect x="275" y="321" width="6" height="6" transform="rotate(-90 275 321)" fill="black"/>
        <rect x="263" y="321" width="6" height="6" transform="rotate(-90 263 321)" fill="black"/>
      </g>

      {/* Main body elements */}
      <rect x="252" y="236" width="3" height="3" fill="black"/>
      <rect x="258" y="216" width="3" height="3" fill="black"/>
      <rect x="258" y="213" width="3" height="3" fill="black"/>
      <rect x="261" y="213" width="3" height="3" fill="black"/>
      <rect x="261" y="216" width="3" height="3" fill="black"/>
      <rect x="264" y="213" width="3" height="3" fill="black"/>
      <rect x="264" y="216" width="3" height="3" fill="black"/>
      <path d="M267 213H270V216H267V213Z" fill="black"/>
      <path d="M279 231H282V234H279V231Z" fill="black"/>
      <path d="M267 210H270V213H267V210Z" fill="black"/>
      <path d="M218 261H221V264H218V261Z" fill="black"/>
      <path d="M267 204H270V207H267V204Z" fill="black"/>
      <path d="M267 207H270V210H267V207Z" fill="black"/>
      <path d="M267 201H270V204H267V201Z" fill="black"/>
      <path d="M270 201H273V204H270V201Z" fill="black"/>
      <path d="M267 195H270V198H267V195Z" fill="black"/>
      <path d="M267 198H270V201H267V198Z" fill="black"/>
      <path d="M267 192H270V195H267V192Z" fill="black"/>
      <rect x="249" y="236" width="3" height="3" fill="black"/>
      <rect x="246" y="236" width="3" height="3" fill="black"/>

      {/* Horn, head, neck area */}
      <path d="M285 141H291V144H285V141Z" fill="black"/>
      <path d="M300 141L300 147L297 147L297 141L300 141Z" fill="black"/>
      <path d="M300 147L300 153L297 153L297 147L300 147Z" fill="black"/>
      <path d="M315 159L315 165L312 165L312 159L315 159Z" fill="black"/>
      <path d="M315 165L315 171L312 171L312 165L315 165Z" fill="black"/>
      <path d="M321 176L315 176L315 173L321 173L321 176Z" fill="black"/>
      <rect x="312" y="174" width="6" height="3" transform="rotate(-180 312 174)" fill="black"/>
      <rect x="315" y="174" width="3" height="3" transform="rotate(-180 315 174)" fill="black"/>
      <rect x="342" y="176" width="3" height="3" transform="rotate(-180 342 176)" fill="black"/>
      <rect x="352" y="161" width="3" height="3" transform="rotate(-180 352 161)" fill="black"/>
      <rect x="332" y="149" width="3" height="3" transform="rotate(-180 332 149)" fill="black"/>
      <path d="M300 153L300 159L297 159L297 153L300 153Z" fill="black"/>
      <path d="M285 150L285 156L282 156L282 150L285 150Z" fill="black"/>
      <path d="M285 156L285 162L282 162L282 156L285 156Z" fill="black"/>
      <path d="M285 162L285 168L282 168L282 162L285 162Z" fill="black"/>
      <path d="M285 168L285 174L282 174L282 168L285 168Z" fill="black"/>
      <path d="M285 174L285 180L282 180L282 174L285 174Z" fill="black"/>
      <path d="M273 234L267 234L267 231L273 231L273 234Z" fill="black"/>
      <path d="M267 234L261 234L261 231L267 231L267 234Z" fill="black"/>

      {/* Body fill areas */}
      <rect x="203" y="246" width="6" height="6" transform="rotate(-90 203 246)" fill="black"/>
      <rect x="203" y="240" width="6" height="6" transform="rotate(-90 203 240)" fill="black"/>
      <rect x="197" y="240" width="6" height="6" transform="rotate(-90 197 240)" fill="black"/>
      <rect x="261" y="213" width="6" height="6" transform="rotate(-90 261 213)" fill="black"/>
      <rect x="261" y="207" width="6" height="6" transform="rotate(-90 261 207)" fill="black"/>
      <path d="M276 198H279V201H276V198Z" fill="black"/>
      <path d="M276 192H279V195H276V192Z" fill="black"/>
      <path d="M276 195H279V198H276V195Z" fill="black"/>
      <path d="M276 189H279V192H276V189Z" fill="black"/>
      <rect x="276" y="186" width="3" height="3" fill="black"/>
      <rect x="276" y="183" width="3" height="3" fill="black"/>
      <rect x="276" y="180" width="3" height="3" fill="black"/>
      <rect x="270" y="201" width="6" height="6" transform="rotate(-90 270 201)" fill="black"/>
      <rect x="270" y="195" width="6" height="6" transform="rotate(-90 270 195)" fill="black"/>
      <path d="M294 198H297V201H294V198Z" fill="black"/>
      <path d="M303 208H306V211H303V208Z" fill="black"/>
      <path d="M294 192H297V195H294V192Z" fill="black"/>
      <path d="M294 195H297V198H294V195Z" fill="black"/>
      <path d="M294 189H297V192H294V189Z" fill="black"/>
      <rect x="288" y="201" width="6" height="6" transform="rotate(-90 288 201)" fill="black"/>
      <path d="M294 204H297V207H294V204Z" fill="black"/>
      <path d="M297 205H300V208H297V205Z" fill="black"/>
      <path d="M300 205H303V208H300V205Z" fill="black"/>
      <path d="M294 201H297V204H294V201Z" fill="black"/>
      <rect x="288" y="207" width="6" height="6" transform="rotate(-90 288 207)" fill="black"/>
      <rect x="297" y="205" width="6" height="6" transform="rotate(-90 297 205)" fill="black"/>
      <rect x="288" y="195" width="6" height="6" transform="rotate(-90 288 195)" fill="black"/>
      <rect x="270" y="189" width="6" height="6" transform="rotate(-90 270 189)" fill="black"/>
      <rect x="285" y="186" width="3" height="3" fill="black"/>
      <rect x="285" y="183" width="3" height="3" fill="black"/>
      <rect x="285" y="180" width="3" height="3" fill="black"/>
      <path d="M279 180H285V183H279V180Z" fill="black"/>
      <rect x="279" y="189" width="6" height="6" transform="rotate(-90 279 189)" fill="black"/>
      <rect x="285" y="180" width="6" height="6" transform="rotate(-90 285 180)" fill="black"/>
      <rect x="285" y="174" width="6" height="6" transform="rotate(-90 285 174)" fill="black"/>
      <rect x="285" y="168" width="6" height="6" transform="rotate(-90 285 168)" fill="black"/>
      <rect x="285" y="162" width="6" height="6" transform="rotate(-90 285 162)" fill="black"/>
      <rect x="285" y="156" width="6" height="6" transform="rotate(-90 285 156)" fill="black"/>
      <rect x="285" y="150" width="6" height="6" transform="rotate(-90 285 150)" fill="black"/>
      <rect x="291" y="153" width="6" height="6" transform="rotate(-90 291 153)" fill="black"/>
      <rect x="291" y="159" width="6" height="6" transform="rotate(-90 291 159)" fill="black"/>
      <rect x="300" y="159" width="6" height="6" transform="rotate(-90 300 159)" fill="black"/>
      <rect x="300" y="165" width="6" height="6" transform="rotate(-90 300 165)" fill="black"/>
      <rect x="306" y="165" width="6" height="6" transform="rotate(-90 306 165)" fill="black"/>
      <rect x="343" y="167" width="6" height="6" transform="rotate(-90 343 167)" fill="black"/>
      <rect x="306" y="171" width="6" height="6" transform="rotate(-90 306 171)" fill="black"/>
      <rect x="315" y="173" width="6" height="6" transform="rotate(-90 315 173)" fill="black"/>
      <path d="M327 176L321 176L321 173L327 173L327 176Z" fill="black"/>
      <rect x="321" y="173" width="6" height="6" transform="rotate(-90 321 173)" fill="black"/>
      <path d="M333 176L327 176L327 173L333 173L333 176Z" fill="black"/>
      <rect x="327" y="173" width="6" height="6" transform="rotate(-90 327 173)" fill="black"/>
      <rect x="323" y="155" width="6" height="6" transform="rotate(-90 323 155)" fill="black"/>
      <path d="M339 176L333 176L333 173L339 173L339 176Z" fill="black"/>
      <path d="M342 167L342 173L339 173L339 167L342 167Z" fill="black"/>
      <path d="M352 161L352 167L349 167L349 161L352 161Z" fill="black"/>
      <path d="M332 149L332 155L329 155L329 149L332 149Z" fill="black"/>
      <path d="M329 149L323 149L323 146L329 146L329 149Z" fill="black"/>
      <path d="M349 161L343 161L343 158L349 158L349 161Z" fill="black"/>
      <rect x="361" y="153" width="3" height="3" transform="rotate(-180 361 153)" fill="black"/>
      <rect x="352" y="159" width="6" height="6" transform="rotate(-90 352 159)" fill="black"/>
      <path d="M361 153L361 159L358 159L358 153L361 153Z" fill="black"/>
      <path d="M358 153L352 153L352 150L358 150L358 153Z" fill="black"/>
      <rect x="361" y="144" width="3" height="3" transform="rotate(-180 361 144)" fill="black"/>
      <rect x="346" y="130" width="3" height="3" transform="rotate(-180 346 130)" fill="black"/>
      <rect x="352" y="150" width="6" height="6" transform="rotate(-90 352 150)" fill="black"/>
      <path d="M361 144L361 150L358 150L358 144L361 144Z" fill="black"/>
      <path d="M358 144L352 144L352 141L358 141L358 144Z" fill="black"/>
      <rect x="352" y="141" width="6" height="6" transform="rotate(-90 352 141)" fill="black"/>
      <rect x="352" y="135" width="6" height="6" transform="rotate(-90 352 135)" fill="black"/>
      <path d="M361 135L361 141L358 141L358 135L361 135Z" fill="black"/>
      <path d="M361 129L361 135L358 135L358 129L361 129Z" fill="black"/>
      <path d="M352 130L346 130L346 127L352 127L352 130Z" fill="black"/>
      <rect x="337" y="118" width="3" height="3" transform="rotate(-180 337 118)" fill="black"/>
      <path d="M343 118L337 118L337 115L343 115L343 118Z" fill="black"/>
      <rect x="343" y="127" width="6" height="6" transform="rotate(-90 343 127)" fill="black"/>
      <rect x="343" y="121" width="6" height="6" transform="rotate(-90 343 121)" fill="black"/>
      <rect x="334" y="115" width="6" height="6" transform="rotate(-90 334 115)" fill="black"/>
      <path d="M352 121L352 127L349 127L349 121L352 121Z" fill="black"/>
      <path d="M343 109L343 115L340 115L340 109L343 109Z" fill="black"/>
      <rect x="334" y="109" width="6" height="6" transform="rotate(-90 334 109)" fill="black"/>
      <path d="M343 103L343 109L340 109L340 103L343 103Z" fill="black"/>
      <rect x="334" y="103" width="6" height="6" transform="rotate(-90 334 103)" fill="black"/>
      <path d="M343 97L343 103L340 103L340 97L343 97Z" fill="black"/>
      <rect x="331" y="97" width="3" height="3" transform="rotate(-180 331 97)" fill="black"/>
      <rect x="337" y="58" width="3" height="3" transform="rotate(-180 337 58)" fill="black"/>
      <rect x="308" y="29" width="3" height="3" transform="rotate(-180 308 29)" fill="black"/>
      <rect x="263" y="35" width="3" height="3" transform="rotate(-180 263 35)" fill="black"/>
      <rect x="263" y="50" width="3" height="3" transform="rotate(-180 263 50)" fill="black"/>
      <rect x="281" y="56" width="3" height="3" transform="rotate(-180 281 56)" fill="black"/>
      <rect x="362" y="30" width="3" height="3" transform="rotate(-180 362 30)" fill="black"/>
      <path d="M337 97L331 97L331 94L337 94L337 97Z" fill="black"/>
      <rect x="328" y="94" width="6" height="6" transform="rotate(-90 328 94)" fill="black"/>
      <path d="M337 88L337 94L334 94L334 88L337 88Z" fill="black"/>
      <rect x="328" y="88" width="6" height="6" transform="rotate(-90 328 88)" fill="black"/>
      <path d="M337 82L337 88L334 88L334 82L337 82Z" fill="black"/>
      <rect x="328" y="82" width="6" height="6" transform="rotate(-90 328 82)" fill="black"/>
      <path d="M337 76L337 82L334 82L334 76L337 76Z" fill="black"/>
      <rect x="328" y="76" width="6" height="6" transform="rotate(-90 328 76)" fill="black"/>
      <path d="M337 70L337 76L334 76L334 70L337 70Z" fill="black"/>
      <rect x="328" y="70" width="6" height="6" transform="rotate(-90 328 70)" fill="black"/>
      <path d="M337 64L337 70L334 70L334 64L337 64Z" fill="black"/>
      <rect x="328" y="64" width="6" height="6" transform="rotate(-90 328 64)" fill="black"/>
      <rect x="335" y="49" width="6" height="6" transform="rotate(-90 335 49)" fill="black"/>
      <rect x="335" y="55" width="6" height="6" transform="rotate(-90 335 55)" fill="black"/>
      <path d="M337 58L337 64L334 64L334 58L337 58Z" fill="black"/>
      <path d="M344 49L344 55L341 55L341 49L344 49Z" fill="black"/>
      <path d="M344 43L344 49L341 49L341 43L344 43Z" fill="black"/>
      <path d="M335 43L335 49L332 49L332 43L335 43Z" fill="black"/>
      <path d="M335 49L335 55L332 55L332 49L335 49Z" fill="black"/>
      <rect x="344" y="40" width="6" height="6" transform="rotate(-90 344 40)" fill="black"/>
      <rect x="344" y="46" width="6" height="6" transform="rotate(-90 344 46)" fill="black"/>
      <path d="M353 40L353 46L350 46L350 40L353 40Z" fill="black"/>
      <rect x="353" y="36" width="6" height="6" transform="rotate(-90 353 36)" fill="black"/>
      <path d="M362 30L362 36L359 36L359 30L362 30Z" fill="black"/>
      <path d="M359 30L353 30L353 27L359 27L359 30Z" fill="black"/>
      <rect x="377" y="15" width="3" height="3" transform="rotate(-180 377 15)" fill="black"/>
      <rect x="356" y="9" width="3" height="3" transform="rotate(-180 356 9)" fill="black"/>
      <rect x="368" y="21" width="6" height="6" transform="rotate(-90 368 21)" fill="black"/>
      <path d="M377 15L377 21L374 21L374 15L377 15Z" fill="black"/>
      <path d="M374 15L368 15L368 12L374 12L374 15Z" fill="black"/>
      <rect x="368" y="12" width="6" height="6" transform="rotate(-90 368 12)" fill="black"/>
      <rect x="365" y="6" width="6" height="6" transform="rotate(-90 365 6)" fill="black"/>
      <rect x="371" y="6" width="6" height="6" transform="rotate(-90 371 6)" fill="black"/>
      <rect x="359" y="6" width="6" height="6" transform="rotate(-90 359 6)" fill="black"/>
      <rect x="353" y="6" width="6" height="6" transform="rotate(-90 353 6)" fill="black"/>
      <rect x="347" y="17" width="6" height="6" transform="rotate(-90 347 17)" fill="black"/>
      <path d="M377 6L377 12L374 12L374 6L377 6Z" fill="black"/>
      <path d="M368 9L362 9L362 6L368 6L368 9Z" fill="black"/>
      <path d="M362 9L356 9L356 6L362 6L362 9Z" fill="black"/>
      <path d="M353 11L347 11L347 8L353 8L353 11Z" fill="black"/>
      <path d="M338 23L338 17L341 17L341 23L338 23Z" fill="black"/>
      <rect x="341" y="17" width="6" height="6" transform="rotate(-90 341 17)" fill="black"/>
      <rect x="335" y="17" width="6" height="6" transform="rotate(-90 335 17)" fill="black"/>
      <rect x="332" y="23" width="6" height="6" transform="rotate(-90 332 23)" fill="black"/>
      <rect x="326" y="23" width="6" height="6" transform="rotate(-90 326 23)" fill="black"/>
      <rect x="326" y="29" width="6" height="6" transform="rotate(-90 326 29)" fill="black"/>
      <rect x="323" y="35" width="6" height="6" transform="rotate(-90 323 35)" fill="black"/>
      <rect x="317" y="35" width="6" height="6" transform="rotate(-90 317 35)" fill="black"/>
      <rect x="305" y="26" width="6" height="6" transform="rotate(-90 305 26)" fill="black"/>
      <rect x="299" y="26" width="6" height="6" transform="rotate(-90 299 26)" fill="black"/>
      <rect x="308" y="35" width="6" height="6" transform="rotate(-90 308 35)" fill="black"/>
      <rect x="332" y="29" width="6" height="6" transform="rotate(-90 332 29)" fill="black"/>
      <rect x="311" y="41" width="6" height="6" transform="rotate(-90 311 41)" fill="black"/>
      <path d="M317 50V44H299V53H290V68H299V74H317V71H322V62H328V55H325V54H319V50H317Z" fill="#F90609"/>
      <path d="M353 9V17V25H359V18H368V9H353Z" fill="#B0171F"/>
      <path d="M359 25H353V17H341V23H338V29H329V36H344V34H353V27H359V25Z" fill="#3D44D8"/>
      <path d="M317 35H328.5H329V36H344V43H332V55H325V54H319V50H317V44V35Z" fill="#0EBB1E"/>
      <rect x="305" y="41" width="6" height="6" transform="rotate(-90 305 41)" fill="black"/>
      <rect x="299" y="44" width="6" height="6" transform="rotate(-90 299 44)" fill="black"/>
      <path d="M347 11L341 11L341 8L347 8L347 11Z" fill="black"/>
      <path d="M326 29L320 29L320 26L326 26L326 29Z" fill="black"/>
      <path d="M320 29L314 29L314 26L320 26L320 29Z" fill="black"/>
      <path d="M317 44L311 44L311 41L317 41L317 44Z" fill="black"/>
      <path d="M311 44L305 44L305 41L311 41L311 44Z" fill="black"/>
      <path d="M314 29L308 29L308 26L314 26L314 29Z" fill="black"/>
      <path d="M311 20L305 20L305 17L311 17L311 20Z" fill="black"/>
      <path d="M305 20L299 20L299 17L305 17L305 20Z" fill="black"/>
      <rect x="293" y="26" width="6" height="6" transform="rotate(-90 293 26)" fill="black"/>
      <rect x="287" y="26" width="6" height="6" transform="rotate(-90 287 26)" fill="black"/>
      <rect x="281" y="26" width="6" height="6" transform="rotate(-90 281 26)" fill="black"/>
      <rect x="275" y="26" width="6" height="6" transform="rotate(-90 275 26)" fill="black"/>
      <path d="M299 20L293 20L293 17L299 17L299 20Z" fill="black"/>
      <path d="M287 20L281 20L281 17L287 17L287 20Z" fill="black"/>
      <path d="M293 20L287 20L287 17L293 17L293 20Z" fill="black"/>
      <path d="M281 20L275 20L275 17L281 17L281 20Z" fill="black"/>
      <rect x="275" y="35" width="6" height="6" transform="rotate(-90 275 35)" fill="black"/>
      <path d="M281 29L275 29L275 26L281 26L281 29Z" fill="black"/>
      <rect x="269" y="35" width="6" height="6" transform="rotate(-90 269 35)" fill="black"/>
      <rect x="281" y="68" width="6" height="6" transform="rotate(-90 281 68)" fill="black"/>
      <path d="M275 29L269 29L269 26L275 26L275 29Z" fill="black"/>
      <path d="M278 56L272 56L272 53L278 53L278 56Z" fill="black"/>
      <path d="M305 86L299 86L299 83L305 83L305 86Z" fill="black"/>
      <path d="M311 86L305 86L305 83L311 83L311 86Z" fill="black"/>
      <path d="M317 86L311 86L311 83L317 83L317 86Z" fill="black"/>
      <path d="M323 80L317 80L317 77L323 77L323 80Z" fill="black"/>
      <path d="M323 77L317 77L317 74L323 74L323 77Z" fill="black"/>
      <path d="M323 74L317 74L317 71L323 71L323 74Z" fill="black"/>
      <path d="M328 71L322 71L322 68L328 68L328 71Z" fill="black"/>
      <path d="M328 68L322 68L322 65L328 65L328 68Z" fill="black"/>
      <path d="M328 65L322 65L322 62L328 62L328 65Z" fill="black"/>
      <rect x="263" y="35" width="6" height="6" transform="rotate(-90 263 35)" fill="black"/>
      <rect x="254" y="26" width="6" height="6" transform="rotate(-90 254 26)" fill="black"/>
      <path d="M269 29L263 29L263 26L269 26L269 29Z" fill="black"/>
      <path d="M260 20L254 20L254 17L260 17L260 20Z" fill="black"/>
      <rect x="248" y="26" width="6" height="6" transform="rotate(-90 248 26)" fill="black"/>
      <rect x="245" y="32" width="6" height="6" transform="rotate(-90 245 32)" fill="black"/>
      <rect x="239" y="32" width="6" height="6" transform="rotate(-90 239 32)" fill="black"/>
      <rect x="245" y="38" width="6" height="6" transform="rotate(-90 245 38)" fill="black"/>
      <rect x="239" y="38" width="6" height="6" transform="rotate(-90 239 38)" fill="black"/>
      <rect x="245" y="44" width="6" height="6" transform="rotate(-90 245 44)" fill="black"/>
      <rect x="245" y="50" width="6" height="6" transform="rotate(-90 245 50)" fill="black"/>
      <rect x="239" y="44" width="6" height="6" transform="rotate(-90 239 44)" fill="black"/>
      <rect x="233" y="44" width="6" height="6" transform="rotate(-90 233 44)" fill="black"/>
      <rect x="227" y="44" width="6" height="6" transform="rotate(-90 227 44)" fill="black"/>
      <rect x="221" y="44" width="6" height="6" transform="rotate(-90 221 44)" fill="black"/>
      <rect x="221" y="50" width="6" height="6" transform="rotate(-90 221 50)" fill="black"/>
      <rect x="215" y="44" width="6" height="6" transform="rotate(-90 215 44)" fill="black"/>
      <rect x="215" y="50" width="6" height="6" transform="rotate(-90 215 50)" fill="black"/>
      <rect x="210" y="65" width="6" height="6" transform="rotate(-90 210 65)" fill="black"/>
      <rect x="210" y="71" width="6" height="6" transform="rotate(-90 210 71)" fill="black"/>
      <rect x="204" y="65" width="6" height="6" transform="rotate(-90 204 65)" fill="black"/>
      <rect x="204" y="71" width="6" height="6" transform="rotate(-90 204 71)" fill="black"/>
      <rect x="204" y="80" width="6" height="6" transform="rotate(-90 204 80)" fill="black"/>
      <rect x="198" y="83" width="6" height="6" transform="rotate(-90 198 83)" fill="black"/>
      <rect x="192" y="83" width="6" height="6" transform="rotate(-90 192 83)" fill="black"/>
      <rect x="198" y="89" width="6" height="6" transform="rotate(-90 198 89)" fill="black"/>
      <rect x="192" y="89" width="6" height="6" transform="rotate(-90 192 89)" fill="black"/>
      <rect x="186" y="81" width="6" height="6" transform="rotate(-90 186 81)" fill="black"/>
      <rect x="180" y="81" width="6" height="6" transform="rotate(-90 180 81)" fill="black"/>
      <rect x="198" y="60" width="6" height="6" transform="rotate(-90 198 60)" fill="black"/>
      <rect x="198" y="66" width="6" height="6" transform="rotate(-90 198 66)" fill="black"/>
      <rect x="192" y="54" width="6" height="6" transform="rotate(-90 192 54)" fill="black"/>
      <rect x="198" y="54" width="6" height="6" transform="rotate(-90 198 54)" fill="black"/>
      <rect x="192" y="60" width="6" height="6" transform="rotate(-90 192 60)" fill="black"/>
      <rect x="245" y="59" width="6" height="6" transform="rotate(-90 245 59)" fill="black"/>
      <rect x="239" y="59" width="6" height="6" transform="rotate(-90 239 59)" fill="black"/>
      <path d="M254 20L248 20L248 17L254 17L254 20Z" fill="black"/>
      <path d="M263 26L263 32L260 32L260 26L263 26Z" fill="black"/>
      <path d="M263 35L263 41L260 41L260 35L263 35Z" fill="black"/>
      <path d="M263 56L263 62L260 62L260 56L263 56Z" fill="black"/>
      <path d="M290 62L290 68L287 68L287 62L290 62Z" fill="black"/>
      <path d="M263 50L263 56L260 56L260 50L263 50Z" fill="black"/>
      <path d="M263 41L263 47L260 47L260 41L263 41Z" fill="black"/>
      <path d="M254 32L254 38L251 38L251 32L254 32Z" fill="black"/>
      <path d="M254 38L254 44L251 44L251 38L254 38Z" fill="black"/>
      <path d="M254 44L254 50L251 50L251 44L254 44Z" fill="black"/>
      <path d="M254 50L254 56L251 56L251 50L254 50Z" fill="black"/>
      <path d="M245 44L245 50L242 50L242 44L245 44Z" fill="black"/>
      <path d="M251 53L245 53L245 50L251 50L251 53Z" fill="black"/>
      <path d="M254 56L254 62L251 62L251 56L254 56Z" fill="black"/>
      <path d="M245 59H251V62H245V59Z" fill="black"/>
      <path d="M236 59L236 53L239 53L239 59L236 59Z" fill="black"/>
      <path d="M245 62L239 62L239 59L245 59L245 62Z" fill="black"/>
      <rect x="263" y="26" width="3" height="3" transform="rotate(-180 263 26)" fill="black"/>
      <rect x="248" y="26" width="3" height="3" transform="rotate(-180 248 26)" fill="black"/>
      <rect x="254" y="29" width="3" height="3" transform="rotate(-180 254 29)" fill="black"/>
      <rect x="239" y="62" width="3" height="3" transform="rotate(-180 239 62)" fill="black"/>
      <rect x="245" y="53" width="3" height="3" transform="rotate(-180 245 53)" fill="black"/>
      <rect x="233" y="68" width="6" height="6" transform="rotate(-90 233 68)" fill="black"/>
      <path d="M230 68L230 62L233 62L233 68L230 68Z" fill="black"/>
      <path d="M239 71L233 71L233 68L239 68L239 71Z" fill="black"/>
      <path d="M242 62L242 68L239 68L239 62L242 62Z" fill="black"/>
      <path d="M192 48L192 54L189 54L189 48L192 48Z" fill="black"/>
      <path d="M192 54L192 60L189 60L189 54L192 54Z" fill="black"/>
      <path d="M210 71H216V74H210V71Z" fill="black"/>
      <path d="M204 71H210V74H204V71Z" fill="black"/>
      <path d="M204 80H210V83H204V80Z" fill="black"/>
      <path d="M186 72H192V75H186V72Z" fill="black"/>
      <path d="M180 72H186V75H180V72Z" fill="black"/>
      <rect x="177" y="72" width="6" height="6" transform="rotate(-90 177 72)" fill="black"/>
      <rect x="171" y="72" width="6" height="6" transform="rotate(-90 171 72)" fill="black"/>
      <path d="M177 63H183V66H177V63Z" fill="black"/>
      <rect x="165" y="72" width="6" height="6" transform="rotate(-90 165 72)" fill="black"/>
      <path d="M165 63H171V66H165V63Z" fill="black"/>
      <path d="M162 72L162 66L165 66L165 72L162 72Z" fill="black"/>
      <path d="M171 63H177V66H171V63Z" fill="black"/>
      <rect x="165" y="63" width="6" height="6" transform="rotate(-90 165 63)" fill="black"/>
      <rect x="159" y="63" width="6" height="6" transform="rotate(-90 159 63)" fill="black"/>
      <rect x="153" y="63" width="6" height="6" transform="rotate(-90 153 63)" fill="black"/>
      <path d="M165 54H171V57H165V54Z" fill="black"/>
      <path d="M159 54H165V57H159V54Z" fill="black"/>
      <path d="M153 54H159V57H153V54Z" fill="black"/>
      <rect x="146" y="52" width="6" height="6" transform="rotate(-90 146 52)" fill="black"/>
      <rect x="140" y="52" width="6" height="6" transform="rotate(-90 140 52)" fill="black"/>
      <rect x="134" y="52" width="6" height="6" transform="rotate(-90 134 52)" fill="black"/>
      <path d="M146 43H152V46H146V43Z" fill="black"/>
      <path d="M140 43H146V46H140V43Z" fill="black"/>
      <path d="M134 43H140V46H134V43Z" fill="black"/>
      <path d="M146 40H152V43H146V40Z" fill="black"/>
      <path d="M140 40H146V43H140V40Z" fill="black"/>
      <path d="M134 40H140V43H134V40Z" fill="black"/>
      <rect x="128" y="52" width="6" height="6" transform="rotate(-90 128 52)" fill="black"/>
      <rect x="122" y="52" width="6" height="6" transform="rotate(-90 122 52)" fill="black"/>
      <rect x="116" y="52" width="6" height="6" transform="rotate(-90 116 52)" fill="black"/>
      <rect x="110" y="54" width="6" height="6" transform="rotate(-90 110 54)" fill="black"/>
      <rect x="104" y="54" width="6" height="6" transform="rotate(-90 104 54)" fill="black"/>
      <rect x="110" y="60" width="6" height="6" transform="rotate(-90 110 60)" fill="black"/>
      <rect x="104" y="60" width="6" height="6" transform="rotate(-90 104 60)" fill="black"/>
      <rect x="101" y="42" width="6" height="6" transform="rotate(-90 101 42)" fill="black"/>
      <rect x="101" y="48" width="6" height="6" transform="rotate(-90 101 48)" fill="black"/>
      <rect x="104" y="66" width="6" height="6" transform="rotate(-90 104 66)" fill="black"/>
      <rect x="98" y="66" width="6" height="6" transform="rotate(-90 98 66)" fill="black"/>
      <rect x="92" y="66" width="6" height="6" transform="rotate(-90 92 66)" fill="black"/>
      <rect x="80" y="81" width="6" height="6" transform="rotate(-90 80 81)" fill="black"/>
      <rect x="62" y="90" width="6" height="6" transform="rotate(-90 62 90)" fill="black"/>
      <rect x="86" y="66" width="6" height="6" transform="rotate(-90 86 66)" fill="black"/>
      <rect x="80" y="66" width="6" height="6" transform="rotate(-90 80 66)" fill="black"/>
      <rect x="74" y="66" width="6" height="6" transform="rotate(-90 74 66)" fill="black"/>
      <rect x="68" y="66" width="6" height="6" transform="rotate(-90 68 66)" fill="black"/>
      <rect x="86" y="60" width="6" height="6" transform="rotate(-90 86 60)" fill="black"/>
      <rect x="80" y="60" width="6" height="6" transform="rotate(-90 80 60)" fill="black"/>
      <rect x="84" y="54" width="6" height="6" transform="rotate(-90 84 54)" fill="black"/>
      <rect x="90" y="54" width="6" height="6" transform="rotate(-90 90 54)" fill="black"/>
      <rect x="78" y="54" width="6" height="6" transform="rotate(-90 78 54)" fill="black"/>
      <rect x="75" y="48" width="6" height="6" transform="rotate(-90 75 48)" fill="black"/>
      <rect x="69" y="48" width="6" height="6" transform="rotate(-90 69 48)" fill="black"/>
      <path d="M128 40H134V43H128V40Z" fill="black"/>
      <path d="M122 40H128V43H122V40Z" fill="black"/>
      <path d="M116 40H122V43H116V40Z" fill="black"/>
      <path d="M98 48L98 42L101 42L101 48L98 48Z" fill="black"/>
      <path d="M98 42L98 36L101 36L101 42L98 42Z" fill="black"/>
      <rect x="92" y="39" width="6" height="6" transform="rotate(-90 92 39)" fill="black"/>
      <path d="M89 39L89 33L92 33L92 39L89 39Z" fill="black"/>
      <rect x="92" y="33" width="6" height="6" transform="rotate(-90 92 33)" fill="black"/>
      <path d="M89 33L89 27L92 27L92 33L89 33Z" fill="black"/>
      <path d="M89 30L83 30L83 27L89 27L89 30Z" fill="black"/>
      <rect x="86" y="27" width="6" height="6" transform="rotate(-90 86 27)" fill="black"/>
      <path d="M83 27L83 21L86 21L86 27L83 27Z" fill="black"/>
      <path d="M80 30L74 30L74 27L80 27L80 30Z" fill="black"/>
      <rect x="65" y="21" width="9" height="9" fill="black"/>
      <rect x="56" y="21" width="9" height="9" fill="black"/>
      <rect x="47" y="30" width="9" height="9" fill="black"/>
      <rect x="38" y="39" width="9" height="9" fill="black"/>
      <rect x="38" y="48" width="9" height="9" fill="black"/>
      <rect x="38" y="57" width="9" height="9" fill="black"/>
      <rect x="62" y="66" width="9" height="9" fill="black"/>
      <rect x="89" y="66" width="9" height="9" fill="black"/>
      <rect x="62" y="75" width="9" height="9" fill="black"/>
      <rect x="53" y="84" width="9" height="9" fill="black"/>
      <rect x="53" y="75" width="9" height="9" fill="black"/>
      <rect x="53" y="93" width="9" height="9" fill="black"/>
      <rect x="44" y="93" width="9" height="9" fill="black"/>
      <rect x="47" y="102" width="9" height="9" fill="black"/>
      <rect x="38" y="105" width="9" height="9" fill="black"/>
      <rect x="29" y="111" width="9" height="9" fill="black"/>
      <rect x="20" y="111" width="9" height="9" fill="black"/>
      <rect x="11" y="111" width="9" height="9" fill="black"/>
      <rect x="6" y="102" width="9" height="9" fill="black"/>
      <rect y="93" width="9" height="9" fill="black"/>
      <rect y="84" width="9" height="9" fill="black"/>
      <rect y="75" width="9" height="9" fill="black"/>
      <rect x="71" y="84" width="9" height="9" fill="black"/>
      <rect x="71" y="93" width="9" height="9" fill="black"/>
      <rect x="71" y="102" width="9" height="9" fill="black"/>
      <rect x="71" y="111" width="9" height="9" fill="black"/>
      <rect x="71" y="120" width="9" height="9" fill="black"/>
      <rect x="71" y="129" width="9" height="9" fill="black"/>
      <rect x="79" y="138" width="9" height="9" fill="black"/>
      <rect x="79" y="147" width="9" height="9" fill="black"/>
      <rect x="79" y="155" width="9" height="9" transform="rotate(90 79 155)" fill="black"/>
      <rect x="70" y="155" width="9" height="9" transform="rotate(90 70 155)" fill="black"/>
      <rect x="52" y="163" width="9" height="9" fill="black"/>
      <rect x="52" y="172" width="9" height="9" fill="black"/>
      <rect x="52" y="181" width="9" height="9" fill="black"/>
      <rect x="52" y="190" width="9" height="9" fill="black"/>
      <rect x="52" y="199" width="9" height="9" fill="black"/>
      <rect x="71" y="211" width="9" height="9" fill="black"/>
      <rect x="71" y="202" width="9" height="9" fill="black"/>
      <rect x="89" y="184" width="9" height="9" fill="black"/>
      <rect x="98" y="184" width="9" height="9" fill="black"/>
      <rect x="107" y="184" width="9" height="9" fill="black"/>
      <rect x="107" y="193" width="9" height="9" fill="black"/>
      <rect x="117" y="202" width="9" height="9" fill="black"/>
      <rect x="117" y="211" width="9" height="9" fill="black"/>
      <rect x="117" y="220" width="9" height="9" fill="black"/>
      <rect x="123" y="229" width="9" height="9" fill="black"/>
      <rect x="132" y="229" width="9" height="9" fill="black"/>
      <rect x="132" y="238" width="9" height="9" fill="black"/>
      <rect x="141" y="238" width="9" height="9" fill="black"/>
      <rect x="150" y="238" width="9" height="9" fill="black"/>
      <rect x="150" y="229" width="9" height="9" fill="black"/>
      <rect x="150" y="221" width="9" height="9" fill="black"/>
      <rect x="150" y="213" width="9" height="9" fill="black"/>
      <rect x="138" y="208" width="9" height="9" fill="black"/>
      <rect x="138" y="199" width="9" height="9" fill="black"/>
      <rect x="138" y="190" width="9" height="9" fill="black"/>
      <rect x="138" y="181" width="9" height="9" fill="black"/>
      <rect x="129" y="190" width="9" height="9" fill="black"/>
      <rect x="129" y="181" width="9" height="9" fill="black"/>
      <rect x="130" y="172" width="9" height="9" fill="black"/>
      <rect x="130" y="163" width="9" height="9" fill="black"/>
      <rect x="130" y="154" width="9" height="9" fill="black"/>
      <rect x="130" y="145" width="9" height="9" fill="black"/>
      <rect x="130" y="136" width="9" height="9" fill="black"/>
      <rect x="121" y="172" width="9" height="9" fill="black"/>
      <rect x="112" y="175" width="9" height="9" fill="black"/>
      <rect x="121" y="163" width="9" height="9" fill="black"/>
      <rect x="147" y="190" width="9" height="9" fill="black"/>
      <rect x="157" y="199" width="9" height="9" fill="black"/>
      <rect x="166" y="206" width="9" height="9" fill="black"/>
      <rect x="175" y="206" width="9" height="9" fill="black"/>
      <rect x="182" y="213" width="9" height="9" fill="black"/>
      <rect x="191" y="225" width="9" height="9" fill="black"/>
      <rect x="218" y="252" width="9" height="9" fill="black"/>
      <rect x="227" y="261" width="9" height="9" fill="black"/>
      <rect x="233" y="270" width="9" height="9" fill="black"/>
      <rect x="80" y="193" width="9" height="9" fill="black"/>
      <rect x="71" y="193" width="9" height="9" fill="black"/>
      <rect x="44" y="208" width="9" height="9" fill="black"/>
      <rect x="35" y="208" width="9" height="9" fill="black"/>
      <rect x="35" y="217" width="9" height="9" fill="black"/>
      <rect x="35" y="226" width="9" height="9" fill="black"/>
      <rect x="44" y="226" width="9" height="9" fill="black"/>
      <rect x="44" y="235" width="9" height="9" fill="black"/>
      <rect x="77" y="27" width="6" height="6" transform="rotate(-90 77 27)" fill="black"/>
      <path d="M74 27L74 21L77 21L77 27L74 27Z" fill="black"/>
      <path d="M53 27L53 21L56 21L56 27L53 27Z" fill="black"/>
      <path d="M128 43H134V46H128V43Z" fill="black"/>
      <path d="M122 43H128V46H122V43Z" fill="black"/>
      <path d="M116 43H122V46H116V43Z" fill="black"/>
      <path d="M95 54L95 60L92 60L92 54L95 54Z" fill="black"/>
      <path d="M89 66L89 72L86 72L86 66L89 66Z" fill="black"/>
      <path d="M80 75L80 81L77 81L77 75L80 75Z" fill="black"/>
      <path d="M71 84L71 90L68 90L68 84L71 84Z" fill="black"/>
      <path d="M89 75L89 81L86 81L86 75L89 75Z" fill="black"/>
      <path d="M89 84L83 84L83 81L89 81L89 84Z" fill="black"/>
      <path d="M83 84L77 84L77 81L83 81L83 84Z" fill="black"/>
      <path d="M44 117L38 117L38 114L44 114L44 117Z" fill="black"/>
      <path d="M44 120L38 120L38 117L44 117L44 120Z" fill="black"/>
      <path d="M44 120L44 114L47 114L47 120L44 120Z" fill="black"/>
      <path d="M15 108L15 102L18 102L18 108L15 108Z" fill="black"/>
      <rect x="27" y="93" width="3" height="3" transform="rotate(-180 27 93)" fill="black"/>
      <rect x="15" y="84" width="9" height="9" fill="black"/>
      <path d="M24 90L24 84L27 84L27 90L24 90Z" fill="black"/>
      <path d="M32 81H38V84H32V81Z" fill="black"/>
      <path d="M26 81H32V84H26V81Z" fill="black"/>
      <path d="M38 123L32 123L32 120L38 120L38 123Z" fill="black"/>
      <path d="M32 123L26 123L26 120L32 120L32 123Z" fill="black"/>
      <path d="M23 123L17 123L17 120L23 120L23 123Z" fill="black"/>
      <path d="M17 123L11 123L11 120L17 120L17 123Z" fill="black"/>
      <path d="M77 84L71 84L71 81L77 81L77 84Z" fill="black"/>
      <path d="M80 54L80 60L77 60L77 54L80 54Z" fill="black"/>
      <path d="M77 60L71 60L71 57L77 57L77 60Z" fill="black"/>
      <path d="M78 51L72 51L72 48L78 48L78 51Z" fill="black"/>
      <path d="M159 63H165V66H159V63Z" fill="black"/>
      <rect x="233" y="71" width="3" height="3" transform="rotate(-180 233 71)" fill="black"/>
      <path d="M227 68L227 62L230 62L230 68L227 68Z" fill="black"/>
      <rect x="230" y="71" width="3" height="3" transform="rotate(-180 230 71)" fill="black"/>
      <rect x="71" y="60" width="3" height="3" transform="rotate(-180 71 60)" fill="black"/>
      <rect x="89" y="75" width="3" height="3" transform="rotate(-180 89 75)" fill="black"/>
      <rect x="72" y="51" width="3" height="3" transform="rotate(-180 72 51)" fill="black"/>
      <rect x="83" y="30" width="3" height="3" transform="rotate(-180 83 30)" fill="black"/>
      <rect x="56" y="30" width="3" height="3" transform="rotate(-180 56 30)" fill="black"/>
      <rect x="156" y="66" width="3" height="3" transform="rotate(-180 156 66)" fill="black"/>
      <rect x="159" y="66" width="3" height="3" transform="rotate(-180 159 66)" fill="black"/>
      <rect x="233" y="77" width="6" height="6" transform="rotate(-90 233 77)" fill="black"/>
      <rect x="224" y="89" width="6" height="6" transform="rotate(-90 224 89)" fill="black"/>
      <rect x="224" y="95" width="6" height="6" transform="rotate(-90 224 95)" fill="black"/>
      <rect x="218" y="95" width="6" height="6" transform="rotate(-90 218 95)" fill="black"/>
      <rect x="218" y="89" width="6" height="6" transform="rotate(-90 218 89)" fill="black"/>
      <path d="M230 77L230 71L233 71L233 77L230 77Z" fill="black"/>
      <path d="M239 80L233 80L233 77L239 77L239 80Z" fill="black"/>
      <rect x="233" y="80" width="3" height="3" transform="rotate(-180 233 80)" fill="black"/>
      <path d="M227 77L227 71L230 71L230 77L227 77Z" fill="black"/>
      <rect x="230" y="80" width="3" height="3" transform="rotate(-180 230 80)" fill="black"/>
      <path d="M236 83L230 83L230 80L236 80L236 83Z" fill="black"/>
      <path d="M230 98L224 98L224 95L230 95L230 98Z" fill="black"/>
      <path d="M224 98L218 98L218 95L224 95L224 98Z" fill="black"/>
      <rect x="212" y="99" width="6" height="6" transform="rotate(-90 212 99)" fill="black"/>
      <path d="M218 102L212 102L212 99L218 99L218 102Z" fill="black"/>
      <path d="M218 105L212 105L212 102L218 102L218 105Z" fill="black"/>
      <rect x="206" y="108" width="6" height="6" transform="rotate(-90 206 108)" fill="black"/>
      <path d="M212 111L206 111L206 108L212 108L212 111Z" fill="black"/>
      <path d="M212 114L206 114L206 111L212 111L212 114Z" fill="black"/>
      <rect x="200" y="108" width="6" height="6" transform="rotate(-90 200 108)" fill="black"/>
      <rect x="194" y="108" width="6" height="6" transform="rotate(-90 194 108)" fill="black"/>
      <rect x="194" y="114" width="6" height="6" transform="rotate(-90 194 114)" fill="black"/>
      <rect x="188" y="114" width="6" height="6" transform="rotate(-90 188 114)" fill="black"/>
      <rect x="188" y="120" width="6" height="6" transform="rotate(-90 188 120)" fill="black"/>
      <rect x="182" y="120" width="6" height="6" transform="rotate(-90 182 120)" fill="black"/>
      <rect x="182" y="114" width="6" height="6" transform="rotate(-90 182 114)" fill="black"/>
      <rect x="177" y="114" width="6" height="6" transform="rotate(-90 177 114)" fill="black"/>
      <rect x="171" y="108" width="6" height="6" transform="rotate(-90 171 108)" fill="black"/>
      <rect x="165" y="108" width="6" height="6" transform="rotate(-90 165 108)" fill="black"/>
      <rect x="162" y="102" width="6" height="6" transform="rotate(-90 162 102)" fill="black"/>
      <rect x="156" y="102" width="6" height="6" transform="rotate(-90 156 102)" fill="black"/>
      <rect x="151" y="102" width="6" height="6" transform="rotate(-90 151 102)" fill="black"/>
      <path d="M206 111L200 111L200 108L206 108L206 111Z" fill="black"/>
      <path d="M206 114L200 114L200 111L206 111L206 114Z" fill="black"/>
      <path d="M174 114L174 108L177 108L177 114L174 114Z" fill="black"/>
      <path d="M171 114L171 108L174 108L174 114L171 114Z" fill="black"/>
      <path d="M171 111L165 111L165 108L171 108L171 111Z" fill="black"/>
      <path d="M168 96L162 96L162 93L168 93L168 96Z" fill="black"/>
      <path d="M162 96L156 96L156 93L162 93L162 96Z" fill="black"/>
      <path d="M157 96L151 96L151 93L157 93L157 96Z" fill="black"/>
      <rect x="145" y="102" width="6" height="6" transform="rotate(-90 145 102)" fill="black"/>
      <path d="M151 96L145 96L145 93L151 93L151 96Z" fill="black"/>
      <rect x="139" y="102" width="6" height="6" transform="rotate(-90 139 102)" fill="black"/>
      <path d="M145 96L139 96L139 93L145 93L145 96Z" fill="black"/>
      <path d="M139 87L139 93L136 93L136 87L139 87Z" fill="black"/>
      <rect x="139" y="93" width="6" height="6" transform="rotate(-90 139 93)" fill="black"/>
      <rect x="139" y="93" width="6" height="6" transform="rotate(-90 139 93)" fill="black"/>
      <rect x="130" y="90" width="6" height="6" transform="rotate(-90 130 90)" fill="black"/>
      <rect x="124" y="90" width="6" height="6" transform="rotate(-90 124 90)" fill="black"/>
      <rect x="145" y="93" width="6" height="6" transform="rotate(-90 145 93)" fill="black"/>
      <rect x="230" y="83" width="3" height="3" transform="rotate(-180 230 83)" fill="black"/>
      <rect x="242" y="71" width="3" height="3" transform="rotate(-180 242 71)" fill="black"/>
      <rect x="254" y="32" width="3" height="3" transform="rotate(-180 254 32)" fill="black"/>
      <path d="M263 17L263 23L260 23L260 17L263 17Z" fill="black"/>
      <path d="M248 17L248 23L245 23L245 17L248 17Z" fill="black"/>
      <path d="M317 29L317 35L314 35L314 29L317 29Z" fill="black"/>
      <path d="M308 29L308 35L305 35L305 29L308 29Z" fill="black"/>
      <rect x="368" y="21" width="3" height="3" transform="rotate(-180 368 21)" fill="black"/>
      <rect x="359" y="27" width="6" height="6" transform="rotate(-90 359 27)" fill="black"/>
      <path d="M368 21L368 27L365 27L365 21L368 21Z" fill="black"/>
      <path d="M368 30L362 30L362 27L368 27L368 30Z" fill="black"/>
      <path d="M365 21L359 21L359 18L365 18L365 21Z" fill="black"/>
      <path d="M353 34L353 40L350 40L350 34L353 34Z" fill="black"/>
      <path d="M334 58L328 58L328 55L334 55L334 58Z" fill="black"/>
      <path d="M352 115L352 121L349 121L349 115L352 115Z" fill="black"/>
      <rect x="333" y="173" width="6" height="6" transform="rotate(-90 333 173)" fill="black"/>
      <rect x="291" y="147" width="6" height="6" transform="rotate(-90 291 147)" fill="black"/>
      <path d="M294 186H297V189H294V186Z" fill="black"/>
      <path d="M294 183H297V186H294V183Z" fill="black"/>
      <path d="M294 180H297V183H294V180Z" fill="black"/>
      <path d="M282 141H285V144H282V141Z" fill="black"/>
      <path d="M279 141H282V144H279V141Z" fill="black"/>
      <path d="M288 180H294V183H288V180Z" fill="black"/>
      <path d="M297 208H303V211H297V208Z" fill="black"/>
      <path d="M297 211H303V214H297V211Z" fill="black"/>
      <path d="M297 214H303V217H297V214Z" fill="black"/>
      <path d="M282 150L282 144L285 144L285 150L282 150Z" fill="black"/>
      <rect x="288" y="189" width="6" height="6" transform="rotate(-90 288 189)" fill="black"/>
      <rect x="243" y="225" width="6" height="3" transform="rotate(-90 243 225)" fill="black"/>
      <rect x="258" y="225" width="6" height="3" transform="rotate(-90 258 225)" fill="black"/>
      <rect x="261" y="225" width="6" height="3" transform="rotate(-90 261 225)" fill="black"/>
      <rect x="246" y="225" width="6" height="6" transform="rotate(-90 246 225)" fill="black"/>
      <rect x="237" y="225" width="6" height="6" transform="rotate(-90 237 225)" fill="black"/>
      <rect x="252" y="225" width="6" height="6" transform="rotate(-90 252 225)" fill="black"/>
      <rect x="261" y="231" width="6" height="6" transform="rotate(-90 261 231)" fill="black"/>
      <rect x="267" y="231" width="6" height="6" transform="rotate(-90 267 231)" fill="black"/>
      <path d="M279 234L273 234L273 231L279 231L279 234Z" fill="black"/>
      <path d="M279 231L279 225L282 225L282 231L279 231Z" fill="black"/>
      <rect x="273" y="231" width="6" height="6" transform="rotate(-90 273 231)" fill="black"/>
      <path d="M297 240H300V243H297V240Z" fill="black"/>
      <path d="M285 243L279 243L279 240L285 240L285 243Z" fill="black"/>
      <path d="M279 243L273 243L273 240L279 240L279 243Z" fill="black"/>
      <rect x="273" y="240" width="6" height="6" transform="rotate(-90 273 240)" fill="black"/>
      <rect x="279" y="240" width="6" height="6" transform="rotate(-90 279 240)" fill="black"/>
      <path d="M291 243L285 243L285 240L291 240L291 243Z" fill="black"/>
      <path d="M297 243L291 243L291 240L297 240L297 243Z" fill="black"/>
      <path d="M297 240L297 234L300 234L300 240L297 240Z" fill="black"/>
      <rect x="285" y="240" width="6" height="6" transform="rotate(-90 285 240)" fill="black"/>
      <rect x="291" y="240" width="6" height="6" transform="rotate(-90 291 240)" fill="black"/>
      <path d="M297 249H300V252H297V249Z" fill="black"/>
      <path d="M297 252L291 252L291 249L297 249L297 252Z" fill="black"/>
      <path d="M297 249L297 243L300 243L300 249L297 249Z" fill="black"/>
      <rect x="291" y="249" width="6" height="6" transform="rotate(-90 291 249)" fill="black"/>
      <path d="M297 258H300V261H297V258Z" fill="black"/>
      <path d="M303 270H306V273H303V270Z" fill="black"/>
      <path d="M312 261H315V264H312V261Z" fill="black"/>
      <path d="M297 261L291 261L291 258L297 258L297 261Z" fill="black"/>
      <path d="M279 261L273 261L273 258L279 258L279 261Z" fill="black"/>
      <path d="M285 267L279 267L279 264L285 264L285 267Z" fill="black"/>
      <path d="M291 267L285 267L285 264L291 264L291 267Z" fill="black"/>
      <path d="M285 270L279 270L279 267L285 267L285 270Z" fill="black"/>
      <path d="M233 273L227 273L227 270L233 270L233 273Z" fill="black"/>
      <path d="M227 264L221 264L221 261L227 261L227 264Z" fill="black"/>
      <path d="M209 252H212V255H209V252Z" fill="black"/>
      <rect x="209" y="243" width="9" height="9" fill="black"/>
      <path d="M218 255L212 255L212 252L218 252L218 255Z" fill="black"/>
      <path d="M209 240H212V243H209V240Z" fill="black"/>
      <path d="M182 222H185V225H182V222Z" fill="black"/>
      <path d="M218 243L212 243L212 240L218 240L218 243Z" fill="black"/>
      <path d="M191 225L191 219L194 219L194 225L191 225Z" fill="black"/>
      <path d="M191 219L191 213L194 213L194 219L191 219Z" fill="black"/>
      <path d="M185 222H191V225H185V222Z" fill="black"/>
      <path d="M291 270L285 270L285 267L291 267L291 270Z" fill="black"/>
      <path d="M279 270L273 270L273 267L279 267L279 270Z" fill="black"/>
      <path d="M297 258L297 252L300 252L300 258L297 258Z" fill="black"/>
      <rect x="291" y="258" width="6" height="6" transform="rotate(-90 291 258)" fill="black"/>
      <rect x="285" y="258" width="6" height="6" transform="rotate(-90 285 258)" fill="black"/>
      <rect x="279" y="258" width="6" height="6" transform="rotate(-90 279 258)" fill="black"/>
      <rect x="285" y="264" width="6" height="6" transform="rotate(-90 285 264)" fill="black"/>
      <rect x="279" y="264" width="6" height="6" transform="rotate(-90 279 264)" fill="black"/>
      <path d="M291 279L285 279L285 276L291 276L291 279Z" fill="black"/>
      <rect x="285" y="276" width="6" height="6" transform="rotate(-90 285 276)" fill="black"/>
      <rect x="279" y="276" width="6" height="6" transform="rotate(-90 279 276)" fill="black"/>
      <rect x="306" y="276" width="6" height="6" transform="rotate(-90 306 276)" fill="black"/>
      <path d="M297 279L291 279L291 276L297 276L297 279Z" fill="black"/>
      <path d="M303 279L297 279L297 276L303 276L303 279Z" fill="black"/>
      <path d="M306 273L306 279L303 279L303 273L306 273Z" fill="black"/>
      <path d="M315 270L315 276L312 276L312 270L315 270Z" fill="black"/>
      <rect x="306" y="270" width="6" height="6" transform="rotate(-90 306 270)" fill="black"/>
      <path d="M315 264L315 270L312 270L312 264L315 264Z" fill="black"/>
      <path d="M306 261H312V264H306V261Z" fill="black"/>
      <path d="M321 259H324V262H321V259Z" fill="black"/>
      <rect x="315" y="268" width="6" height="6" transform="rotate(-90 315 268)" fill="black"/>
      <path d="M324 262L324 268L321 268L321 262L324 262Z" fill="black"/>
      <path d="M324 253L324 259L321 259L321 253L324 253Z" fill="black"/>
      <path d="M324 247L324 253L321 253L321 247L324 247Z" fill="black"/>
      <path d="M324 241L324 247L321 247L321 241L324 241Z" fill="black"/>
      <path d="M324 235L324 241L321 241L321 235L324 235Z" fill="black"/>
      <path d="M330 238L324 238L324 235L330 235L330 238Z" fill="black"/>
      <path d="M330 229L330 235L327 235L327 229L330 229Z" fill="black"/>
      <path d="M324 226H330V229H324V226Z" fill="black"/>
      <path d="M315 229H321V232H315V229Z" fill="black"/>
      <path d="M312 223L312 229L309 229L309 223L312 223Z" fill="black"/>
      <path d="M306 217L306 223L303 223L303 217L306 217Z" fill="black"/>
      <path d="M306 211L306 217L303 217L303 211L306 211Z" fill="black"/>
      <path d="M312 211L306 211L306 208L312 208L312 211Z" fill="black"/>
      <path d="M315 259H321V262H315V259Z" fill="black"/>
      <rect x="315" y="259" width="6" height="6" transform="rotate(-90 315 259)" fill="black"/>
      <rect x="324" y="256" width="6" height="6" transform="rotate(-90 324 256)" fill="black"/>
      <rect x="324" y="250" width="6" height="6" transform="rotate(-90 324 250)" fill="black"/>
      <rect x="324" y="244" width="6" height="6" transform="rotate(-90 324 244)" fill="black"/>
      <rect width="6" height="6" transform="matrix(4.37114e-08 1 1 -4.37114e-08 321 229)" fill="black"/>
      <rect width="6" height="6" transform="matrix(4.37114e-08 1 1 -4.37114e-08 318 223)" fill="black"/>
      <rect width="6" height="6" transform="matrix(4.37114e-08 1 1 -4.37114e-08 312 223)" fill="black"/>
      <rect width="6" height="6" transform="matrix(4.37114e-08 1 1 -4.37114e-08 312 217)" fill="black"/>
      <rect width="6" height="6" transform="matrix(4.37114e-08 1 1 -4.37114e-08 306 217)" fill="black"/>
      <rect width="6" height="6" transform="matrix(4.37114e-08 1 1 -4.37114e-08 306 211)" fill="black"/>
      <rect x="297" y="276" width="6" height="6" transform="rotate(-90 297 276)" fill="black"/>
      <rect x="291" y="276" width="6" height="6" transform="rotate(-90 291 276)" fill="black"/>
      <rect x="273" y="267" width="6" height="6" transform="rotate(-90 273 267)" fill="black"/>
      <rect x="291" y="103" width="9" height="9" fill="black"/>
      <rect x="263" y="35" width="9" height="9" fill="black"/>
      <rect x="263" y="44" width="9" height="9" fill="black"/>
      <rect x="272" y="44" width="9" height="9" fill="black"/>
      <rect x="281" y="53" width="9" height="9" fill="black"/>
      <rect x="281" y="53" width="9" height="9" fill="black"/>
      <rect x="281" y="44" width="9" height="9" fill="black"/>
      <rect x="290" y="44" width="9" height="9" fill="black"/>
      <rect x="290" y="68" width="9" height="9" fill="black"/>
      <rect x="299" y="74" width="9" height="9" fill="black"/>
      <rect x="308" y="74" width="9" height="9" fill="black"/>
      <rect x="263" y="53" width="9" height="9" fill="black"/>
      <rect x="300" y="103" width="9" height="9" fill="black"/>
      <rect x="282" y="94" width="9" height="9" fill="black"/>
      <rect x="282" y="94" width="9" height="9" fill="black"/>
      <rect x="270" y="132" width="9" height="9" fill="black"/>
      <rect x="261" y="126" width="9" height="9" fill="black"/>
      <rect x="252" y="120" width="9" height="9" fill="black"/>
    </svg>
  );
});

export default AnimatedUnicorn;
