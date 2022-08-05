import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Button, variants } from './Button';

export default {
  title: 'lib/Button',
  component: Button,
  argTypes: {
    variant: {
      options: Object.keys(variants),
    },
    children: {
      type: 'string',
    },
    onClick: { action: 'clicked' },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = { variant: 'primary', children: 'Primary' };

export const Secondary = Template.bind({});
Secondary.args = { variant: 'secondary', children: 'Secondary' };

export const Tertiary = Template.bind({});
Tertiary.args = { variant: 'tertiary', children: 'Tertiary' };

export const Text = Template.bind({});
Text.args = {
  variant: 'text',
  children: 'Is it just text? Or is it a button?',
};
