import React, { PropsWithChildren } from 'react';

type IconRowProps = {
  height?: number,
  gap?: number,
  top?: number | null,
}

export const IconItem = ({height = 16, gap = 2, top = null, children}: PropsWithChildren<IconRowProps>) => {
  return <div style={{display: 'inline-block', height, position: 'relative', marginLeft: gap, marginRight: gap, top: top ?? (3/16 * height)}}>{children}</div>;
};

export const IconRow = ({height = 16, gap = 4, children}: PropsWithChildren<IconRowProps>) => {
  if (!children) return null;

  const render = Array.isArray(children) ? children.flatMap((c, i) => [<span key={i.toString()} style={{paddingLeft: gap}} />, c]) : children;
  
  return <div style={{display: 'inline-block', height, position: 'relative', top: 3/16 * height}}>{render}</div>;
};

type SVGProps = {
  color?: string,  
  title?: string,
  size?: string | number,
};

export const SVGNextDown = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
    >
    <g>
      <circle cx="8" cy="8" r="1.56"/>
    </g>
    <g>
      <path d="M8,15.14C5.85,15.14,4.16,12,4.16,8c0-4,1.69-7.14,3.84-7.14S11.84,4,11.84,8C11.84,12,10.15,15.14,8,15.14z M8,1.96
        C6.7,1.96,5.26,4.44,5.26,8S6.7,14.04,8,14.04s2.74-2.48,2.74-6.04S9.3,1.96,8,1.96z"/>
    </g>
    <g>
      <path d="M4.78,12.9c-1.37,0-2.45-0.44-2.96-1.33c-0.55-0.95-0.36-2.21,0.52-3.56c0.81-1.23,2.14-2.42,3.73-3.34
        c1.6-0.92,3.29-1.48,4.76-1.57c1.6-0.09,2.79,0.37,3.34,1.33c1.08,1.87-0.79,4.89-4.26,6.9l0,0C8.11,12.37,6.28,12.9,4.78,12.9z
         M11.24,4.19c-0.11,0-0.22,0-0.33,0.01C9.6,4.28,8.08,4.79,6.63,5.62c-1.45,0.84-2.65,1.9-3.37,2.99c-0.64,0.96-0.81,1.84-0.49,2.4
        c0.65,1.13,3.52,1.14,6.6-0.64l0,0c3.08-1.78,4.51-4.27,3.86-5.4C12.94,4.47,12.22,4.19,11.24,4.19z"/>
    </g>
    <g>
      <path d="M11.24,12.91c-0.13,0-0.27,0-0.4-0.01c-1.47-0.09-3.16-0.64-4.76-1.56c-1.6-0.92-2.92-2.11-3.73-3.34
        C1.46,6.65,1.27,5.38,1.82,4.43c0.55-0.95,1.74-1.42,3.34-1.33C6.64,3.2,8.33,3.75,9.92,4.67c1.6,0.92,2.92,2.11,3.73,3.34
        c0.89,1.34,1.07,2.61,0.52,3.56C13.68,12.44,12.64,12.91,11.24,12.91z M4.76,4.19c-0.98,0-1.7,0.28-1.99,0.79
        c-0.33,0.56-0.15,1.44,0.49,2.4c0.72,1.09,1.92,2.15,3.37,2.99c1.45,0.84,2.97,1.34,4.27,1.42c1.15,0.07,2-0.21,2.33-0.78
        c0.33-0.56,0.15-1.44-0.49-2.4c-0.72-1.09-1.92-2.15-3.37-2.99l0,0C7.92,4.79,6.4,4.28,5.1,4.2C4.98,4.2,4.87,4.19,4.76,4.19z"/>
    </g>
    </svg>
  </div>
);

export const SVGChevronDown = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
    >
    <polygon points="12.8,6.3 11.4,4.9 8,8.3 4.6,4.9 3.2,6.3 7.8,10.9 8,11.1 "/>
    </svg>
  </div>
);

export const SVGChevronRight = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
    >
    <polygon points="6.3,3.2 4.9,4.6 8.3,8 4.9,11.4 6.3,12.8 10.9,8.2 11.1,8 "/>
    </svg>
  </div>
);

export const SVGNextOpen = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
    >
    <polygon points="12.6,6.7 8,11.4 3.4,6.7 2.1,8 7.8,13.7 8,13.9 13.9,8 "/>
    <rect x="7" y="2" width="2" height="9.5"/>
    </svg>
  </div>
);

export const SVGNextClosed = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
    >
    <path d="M29.4-15c0.3-0.3,0.6-0.7,1-1.2c1.7,1.7,3.3,3.4,4.9,5c0.2,0.2,0.3,0.1,0.3-0.2c0-3.6,0-7.2,0-10.8
      c0.6,0,1.1,0,1.8,0c0,3.6,0,7.2,0,11.1c1.8-1.9,3.4-3.5,5.1-5.3c0.5,0.7,0.8,1.1,1,1.4c-2.3,2.3-4.7,4.7-7,7
      C34.2-10.2,31.8-12.6,29.4-15z"/>
    <path d="M3.6,2.1c0.5,0,0.9,0,1.4,0c0,2.4,0,4.7,0,7c2.2,0,4.2,0,6.5,0c-1-0.8-1.8-1.5-2.8-2.4C9.2,6.2,9.6,6,9.8,5.8
      c1.3,1.3,2.7,2.7,4,4.1c-1.3,1.3-2.7,2.7-4.1,4.1c-0.2-0.2-0.5-0.5-1-1c0.9-0.8,1.7-1.5,2.6-2.2c0-0.1-0.1-0.1-0.1-0.2
      c-2.5,0-5.1,0-7.7,0C3.6,7.7,3.6,4.9,3.6,2.1z"/>
    </svg>
  </div>
);

export const SVGAtom = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
    >
    <g>
      <circle cx="8" cy="8" r="1.56"/>
    </g>
    <g>
      <path d="M8,15.14C5.85,15.14,4.16,12,4.16,8c0-4,1.69-7.14,3.84-7.14S11.84,4,11.84,8C11.84,12,10.15,15.14,8,15.14z M8,1.96
        C6.7,1.96,5.26,4.44,5.26,8S6.7,14.04,8,14.04s2.74-2.48,2.74-6.04S9.3,1.96,8,1.96z"/>
    </g>
    <g>
      <path d="M4.78,12.9c-1.37,0-2.45-0.44-2.96-1.33c-0.55-0.95-0.36-2.21,0.52-3.56c0.81-1.23,2.14-2.42,3.73-3.34
        c1.6-0.92,3.29-1.48,4.76-1.57c1.6-0.09,2.79,0.37,3.34,1.33c1.08,1.87-0.79,4.89-4.26,6.9l0,0C8.11,12.37,6.28,12.9,4.78,12.9z
         M11.24,4.19c-0.11,0-0.22,0-0.33,0.01C9.6,4.28,8.08,4.79,6.63,5.62c-1.45,0.84-2.65,1.9-3.37,2.99c-0.64,0.96-0.81,1.84-0.49,2.4
        c0.65,1.13,3.52,1.14,6.6-0.64l0,0c3.08-1.78,4.51-4.27,3.86-5.4C12.94,4.47,12.22,4.19,11.24,4.19z"/>
    </g>
    <g>
      <path d="M11.24,12.91c-0.13,0-0.27,0-0.4-0.01c-1.47-0.09-3.16-0.64-4.76-1.56c-1.6-0.92-2.92-2.11-3.73-3.34
        C1.46,6.65,1.27,5.38,1.82,4.43c0.55-0.95,1.74-1.42,3.34-1.33C6.64,3.2,8.33,3.75,9.92,4.67c1.6,0.92,2.92,2.11,3.73,3.34
        c0.89,1.34,1.07,2.61,0.52,3.56C13.68,12.44,12.64,12.91,11.24,12.91z M4.76,4.19c-0.98,0-1.7,0.28-1.99,0.79
        c-0.33,0.56-0.15,1.44,0.49,2.4c0.72,1.09,1.92,2.15,3.37,2.99c1.45,0.84,2.97,1.34,4.27,1.42c1.15,0.07,2-0.21,2.33-0.78
        c0.33-0.56,0.15-1.44-0.49-2.4c-0.72-1.09-1.92-2.15-3.37-2.99l0,0C7.92,4.79,6.4,4.28,5.1,4.2C4.98,4.2,4.87,4.19,4.76,4.19z"/>
    </g>
    </svg>
  </div>
);

export const SVGInspect = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
      height={size}
    >
    <path d="M15.3,13.5l-4.7-4.7c0.4-0.8,0.7-1.7,0.7-2.6c0-3-2.4-5.4-5.4-5.4c-3,0-5.4,2.4-5.4,5.4c0,3,2.4,5.4,5.4,5.4
      c1.1,0,2.1-0.3,3-0.9l4.6,4.6L15.3,13.5z M2.2,6.1C2.2,4,3.9,2.3,6,2.3c2.1,0,3.8,1.7,3.8,3.8C9.9,8.3,8.1,10,6,10
      C3.9,10,2.2,8.3,2.2,6.1z"/>
    <polygon points="6.5,3.5 6.5,5 7.8,6.3 6.5,7.5 6.5,9 9.3,6.3 "/>
    <polygon points="4.3,6.3 5.5,5 5.5,3.5 2.8,6.3 5.5,9 5.5,7.5 "/>
    </svg>
  </div>
);

export const SVGClose = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
      height={size}
    >
    <rect x="6.6" y="1" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -3.3137 8)" width="2.8" height="14.1"/>
    <rect x="6.6" y="1" transform="matrix(0.7071 0.7071 -0.7071 0.7071 8 -3.3137)" width="2.8" height="14.1"/>

    </svg>
  </div>
);

export const SVGYeet = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
      height={size}
    >
    <g>
    <path d="M9,2.6c1.8,1.8,3.6,3.6,5.3,5.3c-1.8,1.8-3.5,3.6-5.3,5.4C9,9.8,9,6.2,9,2.6z"/>
    <path d="M7,13.4c-0.1-0.1-0.2-0.2-0.3-0.2c-1.7-1.6-3.3-3.3-5-4.9C1.6,8.1,1.6,8,1.8,7.8c1.7-1.6,3.3-3.3,5-5C6.8,2.8,6.9,2.7,7,2.6
      C7,6.2,7,9.8,7,13.4z M3.3,8C4.1,8.8,5,9.7,5.8,10.5c0-1.7,0-3.4,0-5.1C4.9,6.3,4.1,7.2,3.3,8z"/>

    </g>
    </svg>
  </div>
);

export const SVGQuote = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
      height={size}
    >
    <path d="M1.2,8C3.1,9.9,4,10.8,6,12.8c0-0.1,0-0.3,0-0.4c0,0,0,0,0,0c0-0.5,0-1,0-1.5L3.1,7.9L6,5.1C6,5,6,4.9,6,4.8
      c0-0.4,0-0.9,0-1.3c0-0.1,0-0.3,0-0.4C4,5.1,3.2,6,1.2,8z"/>
    <path d="M14.8,7.9C12.9,6,12,5.1,10,3.1c0,0.1,0,0.3,0,0.4c0,0,0,0,0,0c0,0.5,0,1,0,1.5l2.9,2.9L10,10.8c0,0.1,0,0.2,0,0.3
      c0,0.4,0,0.9,0,1.3c0,0.1,0,0.3,0,0.4C12,10.8,12.8,9.8,14.8,7.9z"/>
    <g>
      <rect x="8.8" y="7.4" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -2.9059 8.9846)" width="1.2" height="1.2"/>
      <rect x="6" y="7.4" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -3.7215 7.0154)" width="1.2" height="1.2"/>
    </g>
    </svg>
  </div>
);

export const SVGDashboard = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
      height={size}
    >
    <rect x="2" y="2" width="4" height="12"/>
    <rect x="8" y="2" width="6" height="4"/>
    <rect x="8" y="8" width="6" height="6"/>
    </svg>
  </div>
);

export const SVGBuiltinElement = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
      height={size}
    >
      <g transform="matrix(0.94697,0,0,1,-5.56438,4.39683)">
          <g>
              <path d="M5.876,3.432L10.628,0.954L10.628,2.01C10.628,2.09 10.608,2.163 10.568,2.229C10.528,2.295 10.462,2.352 10.37,2.4L8.192,3.516C8.1,3.564 8.003,3.605 7.901,3.639C7.799,3.673 7.69,3.704 7.574,3.732C7.69,3.76 7.799,3.791 7.901,3.825C8.003,3.859 8.1,3.9 8.192,3.948L10.37,5.07C10.462,5.118 10.528,5.175 10.568,5.241C10.608,5.307 10.628,5.38 10.628,5.46L10.628,6.516L5.876,4.032L5.876,3.432Z"/>
              <path d="M13.31,7.794C13.274,7.886 13.228,7.966 13.172,8.034C13.116,8.102 13.052,8.159 12.98,8.205C12.908,8.251 12.832,8.286 12.752,8.31C12.672,8.334 12.594,8.346 12.518,8.346L11.894,8.346L15.398,-0.618C15.466,-0.786 15.564,-0.915 15.692,-1.005C15.82,-1.095 15.974,-1.14 16.154,-1.14L16.784,-1.14L13.31,7.794Z"/>
              <path d="M18.02,6.516L18.02,5.46C18.02,5.38 18.04,5.307 18.08,5.241C18.12,5.175 18.186,5.118 18.278,5.07L20.456,3.948C20.632,3.86 20.838,3.788 21.074,3.732C20.958,3.704 20.849,3.673 20.747,3.639C20.645,3.605 20.548,3.564 20.456,3.516L18.278,2.4C18.186,2.352 18.12,2.295 18.08,2.229C18.04,2.163 18.02,2.09 18.02,2.01L18.02,0.954L22.772,3.432L22.772,4.032L18.02,6.516Z"/>
          </g>
      </g>
    </svg>
  </div>
);

export const SVGHighlightElement = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
      height={size}
    >
    <g>
      <path d="M12.9,8c0,0.7,0,1.4,0,2.1c0,0.5-0.2,0.8-0.6,1c-1.2,0.7-2.6,1.4-3.8,2.1c-0.3,0.2-0.7,0.2-1,0c-1.2-0.7-2.6-1.4-3.8-2.1
        c-0.4-0.2-0.6-0.5-0.6-1c0-1.4,0-2.9,0-4.3c0-0.5,0.2-0.8,0.6-1.1c1.2-0.6,2.4-1.3,3.7-2c0.4-0.2,0.8-0.2,1.2,0
        c1.2,0.7,2.4,1.4,3.7,2.1c0.4,0.2,0.6,0.6,0.6,1C12.9,6.5,12.9,7.2,12.9,8z M8.8,11.5l0.1-0.1c0.8-0.5,1.6-0.9,2.4-1.4
        c0.1,0,0.1-0.2,0.1-0.3c0-0.9,0-1.8,0-2.8c0,0,0-0.1,0-0.2l-0.1,0.1c-0.8,0.5-1.6,0.9-2.4,1.4c-0.1,0-0.1,0.2-0.1,0.3
        c0,0.9,0,1.8,0,2.7L8.8,11.5z M5.2,5.6c0.9,0.5,1.8,1,2.7,1.5c0,0,0.1,0.1,0.1,0.1c0.1,0,0.1-0.1,0.2-0.1c0.6-0.3,1.1-0.7,1.7-1
        c0,0,0.5-0.3,0.8-0.5l-0.2-0.1C9.7,5,9,4.5,8.2,4.1C8.1,4.1,8.1,4,8,4c0,0-0.1,0.1-0.1,0.1c-0.7,0.3-1.4,0.7-2,1.1
        C5.6,5.3,5.4,5.4,5.2,5.6z M7.2,11.5c0-0.1,0-0.1,0-0.1c0-1,0-1.9,0-3c0-0.1-0.1-0.2-0.2-0.2C6.4,8,5.8,7.5,5.2,7.2L4.5,6.8
        c0,0.1,0,0.1,0,0.1c0,1,0,1.9,0,3c0,0.1,0.1,0.2,0.2,0.2c0.3,0.2,0.6,0.3,0.9,0.5C6.1,10.9,6.6,11.2,7.2,11.5z"/>
      <path d="M11.4,13.6c0.6,0,1.2,0,1.8,0c0.2,0,0.3-0.1,0.3-0.3c0-0.5,0-1,0-1.5c0-0.2,0.1-0.3,0.3-0.3c0.3,0,0.6,0,0.9,0
        c0.1,0,0.2,0,0.2,0.2c0,0.8,0,1.5,0,2.3c0,0.4-0.3,0.8-0.7,0.9c-0.1,0-0.3,0.1-0.4,0.1c-0.7,0-1.3,0-2,0c-0.2,0-0.2-0.1-0.2-0.2
        C11.5,14.3,11.4,14,11.4,13.6z"/>
      <path d="M3.2,14.9c-0.4,0-0.8,0-1.2,0C1.4,14.8,1,14.5,1,14c0-0.8,0-1.5,0-2.3c0-0.1,0.1-0.2,0.2-0.2c0.3,0,0.6,0,1,0
        c0.1,0,0.2,0.1,0.2,0.2c0,0.5,0,1,0,1.6c0,0.3,0,0.3,0.3,0.3c0.5,0,1,0,1.5,0c0.2,0,0.2,0,0.2,0.2c0,0.3,0,0.6,0,0.9
        c0,0.2-0.1,0.2-0.2,0.2C3.9,14.9,3.6,14.9,3.2,14.9L3.2,14.9z"/>
      <path d="M1,3.2c0-0.3,0-0.7,0-1c0-0.4,0.1-0.8,0.5-1C1.6,1,1.8,1,2,1c0.7,0,1.5,0,2.2,0c0.2,0,0.2,0.1,0.2,0.2c0,0.3,0,0.6,0,0.8
        S4.4,2.3,4.3,2.3c-0.5,0-1.1,0-1.6,0c-0.2,0-0.3,0-0.3,0.2c0,0.5,0,1.1,0,1.6c0,0.2,0,0.2-0.2,0.2c-0.3,0-0.6,0-0.9,0
        C1,4.4,1,4.3,1,4.2C1,3.9,1,3.5,1,3.2z"/>
      <path d="M11.5,2.3c0-0.4,0-0.9,0-1.3c0.1,0,0.2,0,0.2,0c0.7,0,1.4,0,2.2,0c0.5,0,1,0.4,1,1c0,0.7,0,1.5,0,2.2c0,0.2,0,0.2-0.2,0.2
        c-0.3,0-0.6,0-0.9,0c-0.2,0-0.3,0-0.3-0.3c0-0.5,0-1.1,0-1.6c0-0.2-0.1-0.2-0.2-0.2c-0.5,0-1,0-1.6,0C11.6,2.3,11.6,2.3,11.5,2.3z"
        />
    </g>
    </svg>
  </div>
);

export const SVGPickElement = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
      height={size}
    >
    <g>
      <path d="M7.1,12.8c-0.4-0.1-0.7-0.2-1.1-0.3C3.8,11.8,2.3,9.3,2.8,7c0.5-2.6,2.7-4.3,5.4-4.2c2.3,0.1,4.4,2.1,4.6,4.4
        c0.1,1,0.2,1.1,1.3,1.1c0.6-1.8-0.9-4.8-3-6c-2.7-1.6-5.8-1.2-7.9,1C1,5.5,0.7,8.6,2.3,11.3c1.2,2,4.2,3.5,5.9,2.9
        C8.2,13,8.2,13,7.1,12.8z"/>
      <path d="M11.9,10.6c0.8-0.3,1.5-0.5,2.1-0.8c0-0.1,0-0.1,0-0.2C11.9,9,9.9,8.4,7.6,7.8C8.3,10,8.9,12,9.6,14.1c0.1,0,0.1,0,0.2,0
        c0.3-0.7,0.5-1.3,0.8-2.3c0.9,1,1.7,1.9,2.5,2.8c0.5-0.5,0.9-0.8,1.6-1.4C13.7,12.3,12.8,11.5,11.9,10.6z"/>
      <path d="M7.2,5.4c1.1-0.2,2.2,0.2,2.7,1.2c0.4,0.8,1,0.9,1.7,1C11.7,5.8,9.9,4,7.9,4c-2.4,0-4.1,1.8-4,4.2C3.9,10,6,11.9,7.6,11.6
        c-0.1-0.7-0.3-1.3-1.1-1.7c-1-0.5-1.3-1.5-1.2-2.6C5.5,6.5,6.3,5.6,7.2,5.4z"/>
    </g>
    </svg>
  </div>
);

export const SVGRunCount = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
      height={size}
    >
      <g transform="matrix(1.20425,0,0,1.20425,-4.93308,2.6379)">
          <g>
              <path d="M5.521,5.529C5.521,5.825 5.535,6.132 5.563,6.45C5.591,6.768 5.632,7.087 5.686,7.407C5.74,7.727 5.809,8.041 5.893,8.349C5.977,8.657 6.073,8.945 6.181,9.213C6.205,9.273 6.217,9.327 6.217,9.375C6.217,9.443 6.199,9.498 6.163,9.54C6.127,9.582 6.085,9.617 6.037,9.645L5.551,9.921C5.383,9.577 5.24,9.222 5.122,8.856C5.004,8.49 4.907,8.123 4.831,7.755C4.755,7.387 4.699,7.023 4.663,6.663C4.627,6.303 4.609,5.957 4.609,5.625C4.609,5.065 4.641,4.52 4.705,3.99C4.769,3.46 4.886,2.925 5.056,2.385C5.226,1.845 5.459,1.288 5.755,0.714C6.051,0.14 6.433,-0.471 6.901,-1.119L7.327,-0.837C7.359,-0.817 7.387,-0.79 7.411,-0.756C7.435,-0.722 7.447,-0.681 7.447,-0.633C7.447,-0.569 7.419,-0.495 7.363,-0.411C7.067,0.045 6.805,0.5 6.577,0.954C6.349,1.408 6.157,1.875 6.001,2.355C5.845,2.835 5.726,3.336 5.644,3.858C5.562,4.38 5.521,4.937 5.521,5.529Z"/>
              <path d="M11.869,5.631L11.047,8.175L10.579,8.175C10.499,8.175 10.434,8.148 10.384,8.094C10.334,8.04 10.309,7.969 10.309,7.881C10.309,7.825 10.317,7.773 10.333,7.725L11.011,5.631L9.511,5.631L8.815,7.779C8.771,7.919 8.701,8.02 8.605,8.082C8.509,8.144 8.405,8.175 8.293,8.175L7.831,8.175L8.653,5.631L7.771,5.631C7.599,5.631 7.513,5.551 7.513,5.391C7.513,5.363 7.516,5.334 7.522,5.304C7.528,5.274 7.535,5.239 7.543,5.199L7.633,4.869L8.863,4.869L9.499,2.883L8.101,2.883L8.227,2.457C8.259,2.345 8.314,2.263 8.392,2.211C8.47,2.159 8.585,2.133 8.737,2.133L9.703,2.133L10.411,-0.045C10.451,-0.161 10.516,-0.251 10.606,-0.315C10.696,-0.379 10.799,-0.411 10.915,-0.411L11.383,-0.411L10.555,2.133L12.055,2.133L12.883,-0.411L13.345,-0.411C13.433,-0.411 13.505,-0.387 13.561,-0.339C13.617,-0.291 13.645,-0.227 13.645,-0.147C13.645,-0.103 13.637,-0.063 13.621,-0.027L12.913,2.133L14.197,2.133L14.065,2.559C14.033,2.671 13.979,2.753 13.903,2.805C13.827,2.857 13.715,2.883 13.567,2.883L12.709,2.883L12.073,4.869L13.165,4.869C13.245,4.869 13.309,4.888 13.357,4.926C13.405,4.964 13.429,5.025 13.429,5.109C13.429,5.137 13.427,5.166 13.423,5.196C13.419,5.226 13.411,5.261 13.399,5.301L13.303,5.631L11.869,5.631ZM9.715,4.869L11.221,4.869L11.857,2.883L10.357,2.883L9.715,4.869Z"/>
              <path d="M16.027,3.273C16.027,2.981 16.013,2.675 15.985,2.355C15.957,2.035 15.914,1.715 15.856,1.395C15.798,1.075 15.728,0.761 15.646,0.453C15.564,0.145 15.469,-0.143 15.361,-0.411C15.337,-0.471 15.325,-0.523 15.325,-0.567C15.325,-0.635 15.343,-0.689 15.379,-0.729C15.415,-0.769 15.457,-0.805 15.505,-0.837L15.997,-1.119C16.161,-0.771 16.302,-0.415 16.42,-0.051C16.538,0.313 16.635,0.679 16.711,1.047C16.787,1.415 16.843,1.779 16.879,2.139C16.915,2.499 16.933,2.847 16.933,3.183C16.933,3.743 16.901,4.288 16.837,4.818C16.773,5.348 16.657,5.883 16.489,6.423C16.321,6.963 16.088,7.519 15.79,8.091C15.492,8.663 15.109,9.273 14.641,9.921L14.221,9.645C14.189,9.621 14.161,9.593 14.137,9.561C14.113,9.529 14.101,9.491 14.101,9.447C14.101,9.379 14.129,9.301 14.185,9.213C14.477,8.757 14.738,8.297 14.968,7.833C15.198,7.369 15.391,6.892 15.547,6.402C15.703,5.912 15.822,5.408 15.904,4.89C15.986,4.372 16.027,3.833 16.027,3.273Z"/>
          </g>
      </g>
    </svg>
  </div>
);

export const SVGLayoutSide = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
      height={size}
    >
      <g>
          <g transform="matrix(0.714286,0,0,1.2,-0.142857,-0.4)">
              <path d="M10,2L10,12L3,12L3,2L10,2ZM8.444,2.926L4.556,2.926L4.556,11.074L8.444,11.074L8.444,2.926Z"/>
          </g>
          <g transform="matrix(1.71429,0,0,1.2,-3.14286,-0.4)">
              <path d="M10,2L10,12L3,12L3,2L10,2ZM9.352,2.926L3.648,2.926L3.648,11.074L9.352,11.074L9.352,2.926Z"/>
          </g>
      </g>
    </svg>
  </div>
);

export const SVGLayoutFull = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
      height={size}
    >
      <g transform="matrix(1.71429,0,0,1.2,-3.14286,-0.4)">
          <g>
              <path d="M10,2L10,12L3,12L3,2L10,2ZM8.769,3.759L4.231,3.759L4.231,10.241L8.769,10.241L8.769,3.759Z"/>
          </g>
      </g>
    </svg>
  </div>
);

export const SVGViewOutput = ({color = '#fff', title = undefined, size = 16}: SVGProps) => (
  <div title={title} style={{display: 'inline-block', width: size, height: 0}}>
    <svg version="1.1" id="Layer_1" x="0px" y="0px"
      style={{fill: 'currentColor'}}
      viewBox="0 0 16 16"
      height={size}
    >
    <g>
      <path d="M8,12.2c-3.7,0-6.9-2.3-6.9-4.2c0-1.9,3.1-4.2,6.9-4.2c3.7,0,6.9,2.3,6.9,4.2C14.9,9.9,11.7,12.2,8,12.2z M8,5.2
      	C4.9,5.2,2.5,7.1,2.5,8c0,0.8,2.4,2.8,5.5,2.8c3.2,0,5.5-2,5.5-2.8C13.5,7.2,11.2,5.2,8,5.2z"/>
      <circle cx="8" cy="8" r="2.7"/>
    </g>
    </svg>
  </div>
);