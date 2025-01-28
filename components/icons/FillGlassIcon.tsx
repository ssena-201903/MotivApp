import { SvgXml } from "react-native-svg";

type Props = {
  height: number;
  width: number;
}

export default function FillGlassIcon ({ width, height } : Props) {
  const svgData = `
<svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.90116 20.1104L1 3C2.47007 3.89813 2.9601 3.44906 3.94015 3C5.41022 3.89813 5.41022 3.89813 6.8803 3C8.35037 3.89813 8.8404 3.89813 10.3105 3C11.7805 3.89813 11.2905 3.89813 12.7606 3L11.0883 20.0973C11.0382 20.6095 10.6076 21 10.093 21H3.89504C3.38549 21 2.95743 20.6169 2.90116 20.1104Z" fill="#FFA38F"/>
<path d="M1 1L2.90995 20.0995C2.96107 20.6107 3.39124 21 3.90499 21H10.095C10.6088 21 11.0389 20.6107 11.09 20.0995L13 1" stroke="#264653" stroke-width="0.75" stroke-linecap="round"/>
</svg>
`;

  return <SvgXml xml={svgData} width={width} height={height}/>;
};
