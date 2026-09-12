export function figureSvg() {
  return `
  <svg viewBox="0 0 360 780" role="img" aria-label="Interactive body atlas">
    <ellipse class="silhouette" cx="180" cy="62" rx="38" ry="46"/>
    <path class="silhouette" d="M154 100 C148 118 146 132 150 148 L210 148 C214 132 212 118 206 100 Z"/>
    <path class="silhouette" d="M150 148 L128 210 L128 305 L232 305 L232 210 L210 148 Z"/>
    <path class="silhouette" d="M128 300 L122 430 L150 430 L154 305 Z"/>
    <path class="silhouette" d="M232 300 L238 430 L210 430 L206 305 Z"/>
    <path class="silhouette" d="M122 428 L118 560 L154 560 L150 428 Z"/>
    <path class="silhouette" d="M238 428 L242 560 L206 560 L210 428 Z"/>
    <path class="silhouette" d="M118 556 L112 700 L150 708 L154 556 Z"/>
    <path class="silhouette" d="M242 556 L248 700 L210 708 L206 556 Z"/>
    <path class="silhouette" d="M88 168 L70 300 L96 308 L124 188 Z"/>
    <path class="silhouette" d="M272 168 L290 300 L264 308 L236 188 Z"/>
    <path class="silhouette" d="M70 298 L48 430 L76 436 L96 306 Z"/>
    <path class="silhouette" d="M290 298 L312 430 L284 436 L264 306 Z"/>
    <ellipse class="region" data-region="crown" cx="180" cy="28" rx="22" ry="10"/>
    <ellipse class="region" data-region="brain" cx="180" cy="58" rx="32" ry="28"/>
    <path class="region" data-region="face" d="M158 78 Q180 108 202 78 Q198 96 180 102 Q162 96 158 78 Z"/>
    <rect class="region" data-region="throat" x="164" y="104" width="32" height="28" rx="10"/>
    <path class="region" data-region="lungs" d="M138 160 Q180 148 222 160 L226 230 Q180 218 134 230 Z"/>
    <path class="region" data-region="heart" d="M168 176 Q180 166 196 178 Q210 198 180 222 Q150 198 168 176 Z"/>
    <ellipse class="region" data-region="solar-plexus" cx="180" cy="242" rx="28" ry="16"/>
    <ellipse class="region" data-region="stomach" cx="192" cy="278" rx="26" ry="20"/>
    <ellipse class="region" data-region="liver" cx="158" cy="278" rx="24" ry="20"/>
    <ellipse class="region" data-region="spleen" cx="214" cy="300" rx="18" ry="14"/>
    <path class="region" data-region="intestines" d="M148 312 H212 Q220 350 180 368 Q140 350 148 312 Z"/>
    <ellipse class="region" data-region="kidneys" cx="156" cy="318" rx="12" ry="16"/>
    <ellipse class="region" data-region="kidneys" cx="204" cy="318" rx="12" ry="16"/>
    <rect class="region" data-region="spine" x="174" y="150" width="12" height="250" rx="5"/>
    <ellipse class="region" data-region="pelvis" cx="180" cy="402" rx="46" ry="28"/>
    <path class="region" data-region="left-arm" d="M124 176 L72 304 L50 428 L78 434 L100 312 L138 196 Z"/>
    <path class="region" data-region="right-arm" d="M236 176 L288 304 L310 428 L282 434 L260 312 L222 196 Z"/>
    <ellipse class="region" data-region="hands" cx="58" cy="448" rx="18" ry="22"/>
    <ellipse class="region" data-region="hands" cx="302" cy="448" rx="18" ry="22"/>
    <path class="region" data-region="left-leg" d="M126 430 L120 556 L114 698 L148 706 L152 430 Z"/>
    <path class="region" data-region="right-leg" d="M234 430 L240 556 L246 698 L212 706 L208 430 Z"/>
    <ellipse class="region" data-region="feet" cx="128" cy="722" rx="28" ry="14"/>
    <ellipse class="region" data-region="feet" cx="232" cy="722" rx="28" ry="14"/>
    <path class="meridian-line" data-meridian="heart" d="M180 190 C140 200 110 260 86 340 C70 400 58 440 52 455"/>
    <path class="meridian-line" data-meridian="pericardium" d="M180 200 C150 220 120 280 96 350 C80 410 64 440 58 452"/>
    <path class="meridian-line" data-meridian="lung" d="M160 168 C130 190 100 250 78 330 C66 390 54 430 48 448"/>
    <path class="meridian-line" data-meridian="large-intestine" d="M308 450 C300 400 292 330 270 250 C250 190 230 150 210 90"/>
    <path class="meridian-line" data-meridian="stomach" d="M198 90 C210 160 206 250 200 340 C210 470 220 600 232 720"/>
    <path class="meridian-line" data-meridian="spleen" d="M118 720 C124 600 132 480 150 360 C160 300 168 250 176 220"/>
    <path class="meridian-line" data-meridian="liver" d="M122 720 C130 580 140 450 158 320 C150 280 148 250 160 210"/>
    <path class="meridian-line" data-meridian="kidney" d="M130 722 C136 620 142 500 156 380 C164 300 170 240 180 200"/>
    <path class="meridian-line" data-meridian="gallbladder" d="M210 70 C230 140 236 260 228 380 C236 520 240 640 238 720"/>
    <path class="meridian-line" data-meridian="bladder" d="M180 50 C186 180 186 320 186 460 C190 580 194 660 200 720"/>
    <path class="meridian-line" data-meridian="triple-warmer" d="M300 450 C292 360 278 270 250 190 C230 130 210 90 200 70"/>
    <path class="nerve-line" data-nerve="vagus" d="M180 70 C170 120 160 170 168 210 C150 250 150 290 160 330 C170 360 176 380 180 400"/>
    <path class="nerve-line" data-nerve="sympathetic" d="M174 120 L174 400"/>
    <path class="nerve-line" data-nerve="sympathetic" d="M186 120 L186 400"/>
    <path class="nerve-line" data-nerve="enteric" d="M156 300 Q180 340 204 300 Q180 280 156 300"/>
    <path class="nerve-line" data-nerve="sciatic" d="M168 410 C150 500 140 600 128 720"/>
    <path class="nerve-line" data-nerve="sciatic" d="M192 410 C210 500 220 600 232 720"/>
    <circle class="acupoint" cx="130" cy="722" r="3"/>
    <circle class="acupoint" cx="180" cy="190" r="3"/>
    <circle class="acupoint" cx="52" cy="455" r="3"/>
    <circle class="acupoint" cx="180" cy="28" r="3"/>
  </svg>`;
}
