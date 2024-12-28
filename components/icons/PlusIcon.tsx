import { SvgXml } from "react-native-svg";

type Props = {
  height: number;
  width: number;
};

export default function PlusIcon({ width, height }: Props) {
  const svgData = `
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.333 2V20.6667" stroke="#264653" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2 11.3335H20.6667" stroke="#264653" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;

  return <SvgXml xml={svgData} width={width} height={height} />;
}
