/**
 * WordPress dependencies
 */
import { SVG, Path, G } from '@wordpress/components';

/**
 * Custom icons
 */
const icons = {};

icons.background =
	<SVG height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><G fill="none" fillRule="evenodd" transform="translate(2.762573 1)"><Path d="m4.93810577 15.6496655-4.30419126-4.3041913c-.67516726-.6751672-.67516726-1.68791812 0-2.36308537l5.48573395-5.31694215 5.40133804 5.40133806c.6751673.67516725.6751673 1.68791816 0 2.36308536l-4.30419124 4.3041913c-.59077135.5907713-1.60352224.5907713-2.27868949-.0843959z" stroke="currentColor" strokeWidth="2" /><Path d="m15.4031982 15.3120819c0 .9283549-.7595631 1.6879181-1.6879181 1.6879181s-1.6879181-.7595632-1.6879181-1.6879181c0-.928355 1.6879181-3.3758363 1.6879181-3.3758363s1.6879181 2.4474813 1.6879181 3.3758363z" fill="currentColor" /><Path d="m.21193497 10c0 .4219795.16879181.8439591.42197954 1.1815427l4.30419126 4.3041913c.67516725.6751672 1.68791814.6751672 2.36308539 0l4.30419124-4.3041913c.2531877-.3375836.4219796-.7595632.4219796-1.1815427z" fill="currentColor" /><Path d="m3.16579172.71158994 6.66727666 6.66727665" stroke="currentColor" strokeWidth="2" /></G></SVG>;

icons.edit =
	<svg className="dashicon components-coblocks-svg" aria-hidden role="img" focusable="false" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
		<path d="m10.330727 5.86705523.8149993.81499936-8.02597188 8.02597191h-.81499935v-.8149994zm3.1891279-5.33293055c.2303259 0 .4517931.07972819.6289669.25690197l2.0729331 2.07293314c.3454889.34548885.3454889.90358624 0 1.24907509l-1.62114 1.62114002-3.3220083-3.32200823 1.6211401-1.62114002c.1683151-.16831509.398641-.25690197.6201082-.25690197zm-3.1891279 2.82592167 3.3220082 3.32200824-9.79770962 9.79770961h-3.32200824v-3.3220082z" transform="translate(1.5 1.5)" />
	</svg>;

icons.trash =
	<svg className="dashicon components-coblocks-svg" aria-hidden role="img" focusable="false" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
		<path d="m9 6.00065104v7.99934896h-6v-7.99934896zm-.85714286-6.00065104.85714286 1.00907841h3v2.01815683h-12v-2.01815683h3l.85714286-1.00907841zm-7.12701513 4.01388889h9.99696179v10.27380951c0 .9417659-.6413752 1.7123016-1.58423237 1.7123016h-6.85714286c-.94285714 0-1.55558656-.7705357-1.55558656-1.7123016z" transform="translate(4 2)" />
	</svg>;

export default icons;
