import { ComponentStory } from '@storybook/react';
import React from 'react';

import { Input, InputProps } from './Input';
import { meta } from '.storybook/utils';

export default meta(Input, {
  argTypes: {
    onChange: { action: 'changed' },
  },
});

const Template: ComponentStory<typeof Input> = (props: InputProps) => (
  <Input {...props} />
);

export const Base = Template.bind({});
Base.args = {
  placeholder: 'Enter Value',
};

export const Invalid = Template.bind({});
Invalid.args = { error: 'This is totally wrong.' };
