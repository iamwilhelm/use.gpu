import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { TextureSource } from '@use-gpu/core/types';
import { provide, makeContext, useContext } from '@use-gpu/live';

export const FeedbackContext = makeContext<TextureSource>(undefined, 'FeedbackContext');

export const useFeedbackContext = () => useContext<FeedbackContextProps>(FeedbackContext);
