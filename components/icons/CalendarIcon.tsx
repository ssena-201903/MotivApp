import { SvgXml } from "react-native-svg";

type Props = {
  width: number;
  height: number;
}

export default function CalendarIcon ({ width, height }: Props) {
  const svgData = `
        <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 3H3C1.89543 3 1 3.89543 1 5V19C1 20.1046 1.89543 21 3 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3Z" stroke="#264653" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 1V5" stroke="#264653" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 1V5" stroke="#264653" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M1 9H19" stroke="#264653" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg> `;
  return <SvgXml xml={svgData} width={width} height={height} />;
};
