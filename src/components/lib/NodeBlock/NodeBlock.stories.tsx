import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { NodeBlock, NodeBlockProps } from './NodeBlock';

export default {
  title: 'lib/NodeBlock',
  component: NodeBlock,
} as ComponentMeta<typeof NodeBlock>;

const Template: ComponentStory<typeof NodeBlock> = (props: NodeBlockProps) => (
  <NodeBlock {...props} />
);

export const Calculators = Template.bind({});
Calculators.args = {
  str: '0x1234',
  className: 'text-white',
  nodeType: 'bytes32',
  children: (
    <p aria-label="decoded event arg index" className="text-gray-600">
      0
    </p>
  ),
};
