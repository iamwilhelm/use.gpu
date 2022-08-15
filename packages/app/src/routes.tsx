import React from '@use-gpu/live';

import { GeometryDataPage } from './pages/geometry/data';
import { GeometryFacesPage } from './pages/geometry/faces';
import { GeometryGLTFPage } from './pages/geometry/gltf';
import { GeometryLinesPage } from './pages/geometry/lines';
import { DebugAtlasPage } from './pages/debug/atlas';
import { DebugQuotePage } from './pages/debug/quote';
import { LayoutDisplayPage } from './pages/layout/display';
import { LayoutGlyphPage } from './pages/layout/glyph';
import { LayoutAlignPage } from './pages/layout/align';
import { MeshRawPage } from './pages/mesh/raw';
import { PlotCartesianPage } from './pages/plot/cartesian';
import { PlotImplicitSurfacePage } from './pages/plot/implicit-surface';
import { PlotPolarPage } from './pages/plot/polar';
import { PlotSphericalPage } from './pages/plot/spherical';
import { PlotStereographicPage } from './pages/plot/stereographic';
import { RTTLinearRGBPage } from './pages/rtt/linear-rgb';
import { RTTFeedbackPage } from './pages/rtt/feedback';
import { RTTCFDComputePage } from './pages/rtt/cfd-compute';
import { RTTCFDTexturePage } from './pages/rtt/cfd-texture';

import { HomePage } from './pages/home';
import { EmptyPage } from './pages/empty';

export const PAGES = [
  {path: "/geometry/lines", title: "Geometry - 3D Lines and Arrows"},
  {path: "/geometry/faces", title: "Geometry - 3D Polygons"},
  {path: "/geometry/data", title: "Geometry - Data-driven Layers"},
  {path: "/geometry/gltf", title: "Geometry - GLTF"},
  {path: "/layout/display", title: "Layout - Box model"},
  {path: "/layout/glyph", title: "Layout - Glyph Subpixel SDF"},
  {path: "/layout/align", title: "Layout - Alignment Tests"},
  {path: "/mesh/raw", title: "Mesh - Direct Rendering"},
  {path: "/plot/cartesian", title: "Plot - XYZ"},
  {path: "/plot/polar", title: "Plot - Polar"},
  {path: "/plot/spherical", title: "Plot - Spherical"},
  {path: "/plot/stereographic", title: "Plot - Stereographic"},
  {path: "/plot/implicit-surface", title: "Plot - Implicit Surface"},
  {path: "/rtt/linear-rgb", title: "RTT - Linear RGB"},
  {path: "/rtt/feedback", title: "RTT - Feedback"},
  {path: "/rtt/cfd-compute", title: "RTT - Fluid Dynamics (Storage)"},
  {path: "/rtt/cfd-texture", title: "RTT - Fluid Dynamics (Texture)"},
  {path: "/debug/atlas", title: "Debug - Text Atlas"},
  //{path: "/debug/quote", title: "Debug - Quoting"},
  {path: "/", title: "Index"},
];

export const makeRoutes = () => ({
  "/geometry/data":         { element: <GeometryDataPage /> },
  "/geometry/faces":        { element: <GeometryFacesPage /> },
  "/geometry/gltf":         { element: <GeometryGLTFPage /> },
  "/geometry/lines":        { element: <GeometryLinesPage /> },
  "/layout/display":        { element: <LayoutDisplayPage /> },
  "/layout/glyph":          { element: <LayoutGlyphPage /> },
  "/layout/align":          { element: <LayoutAlignPage /> },
  "/mesh/raw":              { element: <MeshRawPage /> },
  "/plot/cartesian":        { element: <PlotCartesianPage /> },
  "/plot/polar":            { element: <PlotPolarPage /> },
  "/plot/spherical":        { element: <PlotSphericalPage /> },
  "/plot/stereographic":    { element: <PlotStereographicPage /> },
  "/plot/implicit-surface": { element: <PlotImplicitSurfacePage /> },
  "/rtt/linear-rgb":        { element: <RTTLinearRGBPage /> },
  "/rtt/feedback":          { element: <RTTFeedbackPage /> },
  "/rtt/cfd-compute":       { element: <RTTCFDComputePage /> },
  "/rtt/cfd-texture":       { element: <RTTCFDTexturePage /> },
  "/debug/atlas":           { element: <DebugAtlasPage /> },
  "/debug/quote":           { element: <DebugQuotePage /> },

  "/": { element: <HomePage container={document.querySelector('#use-gpu')} /> },
  "*": { element: <EmptyPage /> },
});
