import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { CalculatorIcon } from 'src/components/icons/CalculatorIcon';

import { Header, HeaderProps } from './Header';

export default {
  title: 'lib/Header',
  component: Header,
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (props: HeaderProps) => (
  <Header {...props} />
);

export const Calculators = Template.bind({});
Calculators.args = {
  icon: <CalculatorIcon height={24} width={24} />,
  text: ['Calculators', 'Number Base Conversion'],
};
