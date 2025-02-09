import React from "react";
import { SvgXml } from "react-native-svg";

type Props = {
  size?: number;
  color?: string;
  variant?: "right" | "left" | "up" | "down";
};

export default function ArrowIcon({ size, color, variant }: Props) {
  let svgIcon;
  if (variant === "right") {
    svgIcon = `
        <svg width="21" height="39" viewBox="0 0 21 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.92188 2.34375L19.0781 19.5L1.92188 36.6562" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    `;
  } else if (variant === "left") {
    svgIcon = `
        <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M43.5625 47.375H5.4375C4.42723 47.3722 3.45915 46.9696 2.74478 46.2552C2.03041 45.5409 1.62783 44.5728 1.625 43.5625V5.4375C1.62783 4.42723 2.03041 3.45915 2.74478 2.74478C3.45915 2.03041 4.42723 1.62783 5.4375 1.625H43.5625C44.5728 1.62783 45.5409 2.03041 46.2552 2.74478C46.9696 3.45915 47.3722 4.42723 47.375 5.4375V43.5625C47.3722 44.5728 46.9696 45.5409 46.2552 46.2552C45.5409 46.9696 44.5728 47.3722 43.5625 47.375Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    `;
  } else if (variant === "down") {

  } else if (variant === "up") {

  }

  return <SvgXml xml={svgIcon} width={size} height={size} />;
}
