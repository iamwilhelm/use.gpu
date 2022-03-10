import { LiveComponent } from '@use-gpu/live/types';

import { use, useMemo, useOne, useResource, useState } from '@use-gpu/live';

import {
  Draw, Pass,
  Flat, Absolute, Layout, Block, Flex, Inline, Element,
  Aggregate,
} from '@use-gpu/components';

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

                        use(Absolute)({
                          left: 0,
                          top: 0,
                          width: '50%',
                          height: '50%',
                          children:

                            use(Flex)({
                              height: '100%',
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

                        }),

                        use(Absolute)({
                          left: 0,
                          top: '50%',
                          width: '50%',
                          height: '50%',
                          children:

                            use(Block)({
                              children: [
                                use(Element)({ height: 200, margin: 10 }),
                                use(Element)({ width: 270, height: 100, border: 10, margin: 10 }),
                                use(Element)({ width: 50, height: 100, margin: 10 }),
                              ]
                            }),
                        }),

                        use(Absolute)({
                          left: '50%',
                          top: 0,
                          right: 0,
                          bottom: '50%',
                          children:
                
                            use(Block)({
                              children: [
                                use(Element)({ radius: [10, 20, 30, 40], border: [3, 10, 20, 5], height: 100 }),

                                use(Absolute)({
                                  left: 10,
                                  top: 10,
                                  right: 10,
                                  bottom: 10,
                                  children:

                                    use(Block)({
                                      direction: 'x',
                                      children: [
                                        use(Element)({ width: 50, radius: 10, border: 5, height: 100, margin: 10 }),
                                        use(Element)({ width: 170, radius: 10, height: 100, margin: 10 }),
                                        use(Element)({ width: 50, radius: 10, height: 100, margin: 10 }),
                                      ]
                                    })

                                }),

                                use(Flex)({
                                  align: ['between', 'center'],
                                  children: [
                                    use(Element)({ radius: [20, 10, 20, 10], border: 12, width: 200, height: 100 }),
                                    use(Element)({ width: 300, border: 4, height: 100, margin: 30, shrink: 1 }),
                                    use(Block)({
                                      children: [
                                        use(Element)({ width: 200, border: 3, height: 100 }),
                                        use(Element)({ radius: [10, 20, 30, 40], width: 300, height: 100 }),
                                        use(Element)({ width: 200, radius: 3, height: 100 }),
                                      ]
                                    }),
                                  ]

                                }),
                                use(Element)({ height: 100 }),
                              ]
                            })
                        }),

                        use(Absolute)({
                          left: '50%',
                          top: 0,
                          right: 0,
                          bottom: '50%',
                          children: [

                            use(Inline)({
                            }),

                          ],
                        }),

                      ],
                    })

                })

            })
      
        }),
    })

  );
};
