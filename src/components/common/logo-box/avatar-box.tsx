import { motion } from 'motion/react';

import { IconAvatar } from '../icon-avatar';

export default function AvatarBox({ checked, size = 44 }: { checked?: boolean; size?: number }) {
  return (
    <IconAvatar
      size={size === 44 ? 'xlarge' : 'small'}
      className="after:button-neutral-gradient relative mb-4 flex items-center justify-center rounded-xl bg-ui-button-neutral shadow-buttons-neutral after:inset-0 after:content-['']"
    >
      {checked && (
        <motion.div
          className="absolute -right-[5px] -top-1 flex size-5 items-center justify-center rounded-full border-[0.5px] border-[rgba(3,7,18,0.2)] bg-[#3B82F6] bg-gradient-to-b from-white/0 to-white/20 shadow-[0px_1px_2px_0px_rgba(3,7,18,0.12),0px_1px_2px_0px_rgba(255,255,255,0.10)_inset,0px_-1px_5px_0px_rgba(255,255,255,0.10)_inset,0px_0px_0px_0px_rgba(3,7,18,0.06)_inset]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.8,
            ease: [0, 0.71, 0.2, 1.01]
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <motion.path
              d="M5.8335 10.4167L9.16683 13.75L14.1668 6.25"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.3,
                delay: 1.1,
                bounce: 0.6,
                ease: [0.1, 0.8, 0.2, 1.01]
              }}
            />
          </svg>
        </motion.div>
      )}
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="44"
          height="44"
          rx="10"
          fill="#FAFAFA"
        />
        <g transform="translate(6 6) scale(0.048)">
          <path
            d="M601.459 96.4405L642.31 85.3128L644.086 92.7313L642.31 98.2951L640.534 103.859L636.981 111.278L631.653 118.696L626.325 124.26L620.997 129.824L615.668 135.388L612.116 139.097L608.564 142.806L606.788 146.515V150.225L608.564 152.079L610.34 153.934H613.892H619.22L622.773 150.225L629.877 142.806L636.981 135.388L645.862 124.26L652.966 114.987L658.295 103.859L661.847 94.5859L663.623 83.4581V74.185L661.847 64.9119L660.071 57.4934L644.086 12.9824L642.31 9.27313L640.534 5.56388L636.981 1.85463L633.429 0L576.594 16.6916L573.042 18.5463L571.266 22.2555V25.9648L587.251 87.1674L589.027 90.8766L590.803 92.7313L592.579 94.5859L597.907 96.4405H601.459Z"
            fill="#FF2E4D"
          />
          <path
            d="M489.167 625.998H63.281C25.654 625.998 -25.0576 603.062 46.9994 544.082L169.824 437.591L6.05789 150.885C-4.85984 120.849 -8.68101 62.4157 63.376 68.969L484.02 68.9691C511.385 68.9688 556.401 75.5642 530.199 121.437L390.901 265.574L538.297 544.082C554.676 571.388 567.78 625.998 489.167 625.998Z"
            fill="#FF2E4D"
          />
        </g>
      </svg>
    </IconAvatar>
  );
}
