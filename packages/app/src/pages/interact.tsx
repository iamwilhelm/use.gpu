import { LiveComponent } from '@use-gpu/live/types';

import { use, useMemo, useOne, useResource, useState } from '@use-gpu/live';

import {
  Draw, Pass, Flat, Absolute, Surface,
} from '@use-gpu/components';
import { Mesh } from '../mesh';
import { makeMesh } from '../meshes/mesh';

export type InteractPageProps = {
  _unused?: boolean,
};

export const InteractPage: LiveComponent<InteractPageProps> = (fiber) => (props) => {

  return (
    use(Draw)({
      children:

        use(Pass)({
          children:

            use(Flat)({
              children:

                use(Absolute)({
                  left: 10,
                  top: 10,
                  width: '50%',
                  bottom: 10,
                  children:
                  
                    use(Surface)({}),

                })

            })
      
        }),
    })

  );
};
