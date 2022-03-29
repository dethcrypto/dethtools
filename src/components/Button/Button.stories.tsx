// eslint-disable-next-line import/no-extraneous-dependencies
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Button } from './Button';

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Button',
  component: Button,
} as ComponentMeta<typeof Button>;

export const Primary: ComponentStory<typeof Button> = () => (
  <Button className="bg-gradient-to-r from-deth-pink to-deth-purple ">
    {' '}
    Hello!{' '}
  </Button>
);
export const Secondary: ComponentStory<typeof Button> = () => (
  <Button className="bg-deth-gray-600 text-deth-gray-300"> Hello! </Button>
);

export const Tertiary: ComponentStory<typeof Button> = () => (
  <Button className="border border-deth-gray-400 bg-deth-gray-900">
    {' '}
    Hello!{' '}
  </Button>
);

export const Link: ComponentStory<typeof Button> = () => (
  <Button className="bg-deth-gray-900"> Hello! </Button>
);
