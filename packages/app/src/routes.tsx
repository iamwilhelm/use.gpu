import React from '@use-gpu/live/jsx';

import { GeometryDataPage } from './pages/geometry/data';
import { GeometryFacesPage } from './pages/geometry/faces';
import { GeometryLinesPage } from './pages/geometry/lines';
import { DebugAtlasPage } from './pages/debug/atlas';
import { DebugGlyphPage } from './pages/debug/glyph';
import { LayoutDisplayPage } from './pages/layout/display';
import { LayoutAlignPage } from './pages/layout/align';
import { MeshRawPage } from './pages/mesh/raw';
import { LinearRGBPage } from './pages/rtt/linear-rgb';
import { FeedbackPage } from './pages/rtt/feedback';
import { PlotSimplePage } from './pages/plot/simple';

import { HomePage } from './pages/home';
import { EmptyPage } from './pages/empty';

export const PAGES = [
  {path: "/geometry/lines", title: "Geometry - 3D Lines and Arrows"},
  {path: "/geometry/faces", title: "Geometry - 3D Polygons"},
  {path: "/geometry/data", title: "Geometry - Data-driven Layers"},
  {path: "/layout/display", title: "Layout - Box model"},
  {path: "/layout/align", title: "Layout - Align"},
  {path: "/mesh/raw", title: "Mesh - Direct Rendering"},
  {path: "/plot/simple", title: "Plot - Simple"},
  {path: "/rtt/linear-rgb", title: "RTT - Linear RGB"},
  {path: "/rtt/feedback", title: "RTT - Feedback"},
  {path: "/debug/atlas", title: "Debug - Text Atlas"},
  {path: "/debug/glyph", title: "Debug - Glyph SDF"},
  {path: "/", title: "Index"},
];

export const makeRoutes = () => ({
  "/geometry/data":  { element: <GeometryDataPage /> },
  "/geometry/faces": { element: <GeometryFacesPage /> },
  "/geometry/lines": { element: <GeometryLinesPage /> },
  "/layout/display": { element: <LayoutDisplayPage /> },
  "/layout/align":   { element: <LayoutAlignPage /> },
  "/mesh/raw":       { element: <MeshRawPage /> },
  "/plot/simple":    { element: <PlotSimplePage /> },
  "/rtt/linear-rgb": { element: <LinearRGBPage /> },
  "/rtt/feedback":   { element: <FeedbackPage /> },
  "/debug/atlas":    { element: <DebugAtlasPage /> },
  "/debug/glyph":    { element: <DebugGlyphPage /> },

  "/": { element: <HomePage container={document.querySelector('#use-gpu')} /> },
  "*": { element: <EmptyPage /> },
});
