import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Input, InputProps } from './Input';

export default {
  title: 'lib/Input',
  component: Input,
  argTypes: {
    onChange: { action: 'changed' },
  },
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (props: InputProps) => (
  <Input {...props} />
);

export const Base = Template.bind({});
Base.args = {
  placeholder: 'Enter Value',
};

export const Invalid = Template.bind({});
Invalid.args = { error: 'This is totally wrong.' };
