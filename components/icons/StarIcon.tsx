import React from "react";
import { SvgXml } from "react-native-svg";

interface StarIconProps {
  height: number;
  width: number;
}

const StarIcon: React.FC<StarIconProps> = ({ width, height }) => {
  const svgData = `
  <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.16667 0L11.9992 5.73833L18.3333 6.66417L13.75 11.1283L14.8317 17.435L9.16667 14.4558L3.50167 17.435L4.58333 11.1283L0 6.66417L6.33417 5.73833L9.16667 0Z" fill="#FF7066"/>
</svg>
`;

  return <SvgXml xml={svgData} width={width} height={height} />;
};

export default StarIcon;