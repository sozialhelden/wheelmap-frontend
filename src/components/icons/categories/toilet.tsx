import React from 'react'

function SvgToilet(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M13.5 2c.828 0 1.5.739 1.5 1.65v7.7c0 .911-.672 1.65-1.5 1.65h-12C.672 13 0 12.261 0 11.35v-7.7C0 2.739.672 2 1.5 2h12zm-1.759 6.284c-.039.343-.146.62-.322.83-.175.209-.419.314-.73.314-.23 0-.425-.05-.586-.147a1.162 1.162 0 01-.39-.39 1.781 1.781 0 01-.217-.546 3.06 3.06 0 010-1.276c.045-.21.118-.398.217-.562.1-.164.23-.296.39-.393.16-.098.356-.147.585-.147.126 0 .246.023.361.068.115.045.218.109.309.19.09.08.167.175.227.282.06.107.1.225.117.354h.988a2.209 2.209 0 00-.22-.787 1.877 1.877 0 00-1.057-.93 2.144 2.144 0 00-.725-.12c-.355 0-.675.068-.959.207a2.071 2.071 0 00-.718.572 2.622 2.622 0 00-.448.854c-.104.327-.156.68-.156 1.062 0 .372.052.718.156 1.04.104.322.253.602.448.84.195.239.435.426.719.562.283.135.603.203.958.203a2.1 2.1 0 00.787-.143 1.8 1.8 0 00.624-.414c.177-.181.32-.4.429-.658.108-.258.175-.546.201-.865h-.988zm-8.677-3.14h-1.02l1.228 5.106h1.033l.774-3.475h.013l.786 3.475h1.014L8.14 5.145h-1l-.761 3.518h-.013l-.793-3.518h-.956L3.811 8.62h-.013l-.734-3.475z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default SvgToilet