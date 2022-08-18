import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { LoadingEntity, LoadingEntityProps } from './LoadingEntity';

export default {
  title: 'lib/LoadingEntity',
  component: LoadingEntity,
} as ComponentMeta<typeof LoadingEntity>;

const Template: ComponentStory<typeof LoadingEntity> = (
  props: LoadingEntityProps,
) => <LoadingEntity {...props} />;

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  className: 'w-full',
};
