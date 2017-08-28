import React from 'react';

export default function AllAccessibilitiesIcon(props) {
  return (<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" {...props}>
    <defs>
        <rect id="path-1" x="0" y="0" width="24" height="24" rx="4"></rect>
        <filter x="-8.3%" y="-8.3%" width="116.7%" height="116.7%" filterUnits="objectBoundingBox" id="filter-2">
            <feGaussianBlur stdDeviation="1.5" in="SourceAlpha" result="shadowBlurInner1"></feGaussianBlur>
            <feOffset dx="0" dy="1" in="shadowBlurInner1" result="shadowOffsetInner1"></feOffset>
            <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite>
            <feColorMatrix values="0 0 0 0 0.788235294   0 0 0 0 0.847058824   0 0 0 0 0.890196078  0 0 0 1 0" type="matrix" in="shadowInnerInner1"></feColorMatrix>
        </filter>
    </defs>
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Filter-Dialog" transform="translate(-213.000000, -530.000000)">
            <g id="Checkboxes" transform="translate(173.000000, 530.000000)">
                <g id="CheckboxChecked" transform="translate(40.000000, 0.000000)">
                    <g id="Rectangle-6-Copy">
                        <use fill="#FFFFFF" fillRule="evenodd" xlink:href="#path-1"></use>
                        <use fill="black" fillOpacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use>
                        <rect stroke="#C9D8E3" strokeWidth="1" x="0.5" y="0.5" width="23" height="23" rx="4"></rect>
                    </g>
                    <polygon id="Fill" fill="#6B93B6" points="9.6097299 19 11.3675184 17.2534247 19 6.77984344 17.1942718 5 9.6097299 15.3405088 6.80572821 12.4383562 5 14.2181996"></polygon>
                </g>
            </g>
        </g>
    </g>
</svg>);
}
