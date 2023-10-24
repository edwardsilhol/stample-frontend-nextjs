import { CSSProperties } from 'react';

function transformCamelToKebab(camelCaseCSS: any) {
  const kebabCaseCSS = {} as any;
  for (const key in camelCaseCSS) {
    const kebabKey = key
      .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
      .toLowerCase();
    kebabCaseCSS[kebabKey] = camelCaseCSS[key];
  }
  return kebabCaseCSS;
}

export function styleObjectToString(styleObject: CSSProperties) {
  return Object.entries(transformCamelToKebab(styleObject))
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
}
