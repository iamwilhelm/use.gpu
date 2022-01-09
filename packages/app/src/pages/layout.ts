import { LiveComponent } from '@use-gpu/live/types';

import { use, useMemo, useOne, useResource, useState } from '@use-gpu/live';

import {
  Draw, Pass,
  Flat, Absolute, Layout, Stack, Flex, Element,
  Aggregate,
} from '@use-gpu/components';
import { Mesh } from '../mesh';
import { makeMesh } from '../meshes/mesh';

export type LayoutPageProps = {
  _unused?: boolean,
};

export const LayoutPage: LiveComponent<LayoutPageProps> = (props) => {

  return (
    use(Draw)({
      children:

        use(Pass)({
          children:

            use(Flat)({
              children:
              
                use(Aggregate)({
                  children:

                    use(Layout)({
                      children: [

                        use(Flex)({
                          align: ['evenly', 'evenly'],
                          anchor: 'center',
                          wrap: true,
                          children: [
                            use(Element)({ width: 50, height: 50,  margin: 10 }),
                            use(Element)({ width: 50, height: 50,  margin: 10 }),
                            use(Element)({ width: 70, height: 120, margin: 10, grow: 1 }),
                            use(Element)({ width: 50, height: 50,  margin: 0 }),
                            use(Element)({ width: 80, height: 50,  margin: 20 }),
                            use(Element)({ width: 50, height: 100, margin: 0 }),
                            use(Element)({ width: 50, height: 100, margin: 0 }),
                            use(Element)({ width: 50, height: 100, margin: 0 }),
                            use(Element)({ width: 80, height: 50,  margin: 0 }),
                            use(Element)({ width: 80, height: 50,  margin: 0 }),
                            use(Element)({ width: 80, height: 50,  margin: 0 }),
                          ]
                        }),
                      
                        use(Stack)({
                          children: [
                            use(Element)({ width: 50, height: 100, margin: 10 }),
                            use(Element)({ width: 70, height: 100, margin: 10 }),
                            use(Element)({ width: 50, height: 100, margin: 10 }),
                          ]
                        }),

                        use(Absolute)({
                          left: '50%',
                          top: 10,
                          right: 10,
                          bottom: 10,
                          children:
                
                            use(Stack)({
                              children: [
                                use(Element)({ height: 100 }),

                                use(Absolute)({
                                  left: 10,
                                  top: 10,
                                  right: 10,
                                  bottom: 10,
                                  children:

                                        use(Stack)({
                                          children: [
                                            use(Element)({ width: 50, height: 100, margin: 10 }),
                                            use(Element)({ width: 170, height: 100, margin: 10 }),
                                            use(Element)({ width: 50, height: 100, margin: 10 }),
                                          ]
                                        })

                                }),

                                use(Flex)({
                                  alignX: 'between',
                                  children: [
                                    use(Element)({ width: 200, height: 100 }),
                                    use(Element)({ width: 300, height: 100, margin: 30, shrink: 1 }),
                                    use(Stack)({
                                      children: [
                                        use(Element)({ width: 200, height: 100 }),
                                        use(Element)({ width: 300, height: 100 }),
                                        use(Element)({ width: 200, height: 100 }),
                                      ]
                                    }),
                                  ]

                                }),
                                use(Element)({}),
                              ]
                            })
                        }),

                      ],
                    })

                })

            })
      
        }),
    })

  );
};
