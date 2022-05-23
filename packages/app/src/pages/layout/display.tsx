import { LC } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import React from '@use-gpu/live/jsx';
import { LayoutControls } from '../../ui/layout-controls';

import {
  LinearRGB, Draw, Pass, Flat, UI, Layout, Absolute, Block, Flex, Inline, Overflow, Text, Element,
  PanControls,
  DebugProvider,
} from '@use-gpu/components';

export const LayoutDisplayPage: LC = () => {

  const view = (
    <LinearRGB>
      <Pass>
        <UI>
          <Layout>
            <Absolute>
              <Element fill={[1, 1, 1, .5]}  />
            </Absolute>
            <Flex width="100%" height="100%">
              <Block width="40%" contain>
                <Block margin={12} padding={48} radius={5} fill={[0, 0, 0, .9]}>

                  <Flex anchor="center">
                    <Element width={48} height={48} fill={[0, 0, 0, .35]} />
                    <Inline margin={[24, 0, 0, 0]}>
                      <Text size={48} weight="bold" lineHeight={56} color={[1, 1, 1, 1]}>Use.GPU</Text>
                    </Inline>
                  </Flex>

                  <Inline margin={[0, 24, 0, 0]}>
                    <Text size={20} color={[1, 1, 1, 1]} weight="bold" lineHeight={24}>{"Lorem ipsum dolor sit amet,"}</Text>
                    <Text size={20} color={[1, 1, 1, 1]} lineHeight={24}>{" consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}</Text>
                  </Inline>

                  <Block margin={[0, 20, 0, 0]} height={2} fill={[1, 1, 1, 1]} snap={false} />

                  <Block margin={[0, 20, 0, 0]} snap={false}>
                    <Flex align="justify-center" gap={[10, 10]} wrap>
                      <Element width={50}  height={50} fill={[0.5, 0.5, 0.5, 0.5]} />
                      <Element width={100} height={50} fill={[0.5, 0.5, 0.5, 0.5]}
                        radius={[20, 0, 20, 0]} border={3} stroke={[0.5, 0.5, 0.5, 1]} />
                      <Element width={110} border={[10, 3, 10, 3]} height={50} fill={[0.5, 0.5, 0.5, 0.5]} stroke={[0.75, 0.75, 0.75, 1]} />
                      <Element width={40} height={50} fill={[0.5, 0.5, 0.5, 0.5]}
                        radius={[1, 10, 1, 1]} border={5} stroke={[0, 0, 0, 0.75]} />
                      <Element width={120} height={50} fill={[0.5, 0.5, 0.5, 0.5]} />
                      <Element width={130} height={50} fill={[0.5, 0.5, 0.5, 0.5]}
                        radius={[15, 10, 20, 55]} border={[5, 5, 5, 10]} stroke={[1.0, 1.0, 1.0, 0.5]} />
                      <Element width={120} height={50} fill={[0.5, 0.5, 0.5, 0.5]}
                        radius={[10, 10, 10, 10]} border={20} stroke={[0.5, 0.5, 0.5, 1]} />
                      <Element width={70} height={50} fill={[0.5, 0.5, 0.5, 0.5]}
                        radius={[10, 10, 10, 10]} border={5} stroke={[0.7, 0.7, 0.7, 0.5]} />
                      <Element width={50}  height={50} fill={[0.5, 0.5, 0.5, 0.5]} />
                      <Element width={140} height={50} fill={[0.5, 0.5, 0.5, 0.5]}
                        radius={[10, 10, 10, 10]} border={5} stroke={[0, 0, 0, 0.75]} />
                      <Element width={100} height={50} fill={[0.5, 0.5, 0.5, 0.5]} />
                      <Element width={100} height={50} fill={[0.5, 0.5, 0.5, 0.5]} />
                      <Element width={50} height={50} fill={[0.5, 0.5, 0.5, 0.5]}
                        radius={[10, 10, 10, 10]} border={5} stroke={[1.0, 1.0, 1.0, 0.5]} />
                      <Element width={70}  height={50} fill={[0.5, 0.5, 0.5, 0.5]} />
                    </Flex>
                  </Block>

                </Block>
              </Block>

              <Block width="60%" height="100%" fill={[0, 0, 0, .9]}>
                <Overflow>
                  <Block padding={48}>

                    <Inline>
                      <Text size={48} weight="bold" lineHeight={56} color={[1, 1, 1, 1]}>Use.GPU</Text>
                    </Inline>

                    <Inline margin={[0, 24, 0, 0]}>
                      <Text size={20} color={[1, 1, 1, 1]} weight="bold" lineHeight={24}>{"Lorem ipsum dolor sit amet,"}</Text>
                      <Text size={20} color={[1, 1, 1, 0.5]} lineHeight={24}>{" consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n"}</Text>

                      <Text size={24} color={[1, 1, 1, 1]} lineHeight={24}>{"Fugiat nulla pariatur."}</Text>
                      <Element margin={[5, 0]} radius={100} width={24} height={24} fill={[0.5, 0.5, 0.5, 0.75]} />
                      <Text size={20} color={[1, 1, 1, 1]} lineHeight={24}>{"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud "}</Text>
											<Block radius={100} fill={[0.2, 0.5, 0.8, 1.0]} padding={[6, 2]} margin={[0, 1, 0, 0]}>
												<Inline><Text size={16} color={[1, 1, 1, 1]}>Aute Cupiditat</Text></Inline>
											</Block>
                      <Text size={20} color={[1, 1, 1, 1]} lineHeight={24}>{" exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}</Text>
                    </Inline>

                    <Block margin={[0, 20, 0, 0]} height={2} fill={[1, 1, 1, 1]} />

                    <Inline margin={[0, 24, 0, 0]}>
                      <Text size={20} color={[1, 1, 1, 1]} weight="bold" lineHeight={24}>{"Lorem ipsum dolor sit amet,"}</Text>
                      <Text size={20} color={[1, 1, 1, 1]} lineHeight={24}>{" consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n"}</Text>

                      <Text size={20} color={[1, 1, 1, 1]} lineHeight={24}>{"Lorem x ipsum dolor sit amet, x consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n"}</Text>

                      <Text size={20} color={[1, 1, 1, 1]} lineHeight={24}>{"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n"}</Text>
                    </Inline>
										

                    <Inline margin={[0, 24, 0, 0]}>
                      <Text size={20} color={[1, 1, 1, 1]} weight="bold" lineHeight={24}>{"Lorem ipsum dolor sit amet,"}</Text>
                      <Text size={20} color={[1, 1, 1, 1]} lineHeight={24}>{" consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n"}</Text>

                      <Text size={20} color={[1, 1, 1, 1]} lineHeight={24}>{"Lorem x ipsum dolor sit amet, x consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n"}</Text>

                      <Text size={20} color={[1, 1, 1, 1]} lineHeight={24}>{"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n"}</Text>
                    </Inline>

                    <Block margin={[0, 20, 0, 0]} height={2} fill={[1, 1, 1, 1]} />

                  </Block>
                </Overflow>
              </Block>

            </Flex>
          </Layout>
        </UI>
      </Pass>
    </LinearRGB>
  );

  const root = document.querySelector('#use-gpu');

  return (
    <LayoutControls
      container={root}
      render={(mode) => 
        <PanControls
          active={mode !== 'inspect'}
          render={(x, y, zoom) =>
            <DebugProvider
              debug={{
                sdf2d: { contours: mode === 'sdf' },
                layout: { inspect: mode === 'inspect' },
              }}
            >
              <Flat x={x} y={y} zoom={zoom}>
                {view}
              </Flat>
            </DebugProvider>
          }
      />}
    />
  );
};
