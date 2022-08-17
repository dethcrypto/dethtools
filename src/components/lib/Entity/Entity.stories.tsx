import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Entity, EntityProps } from './Entity';

export default {
  title: 'lib/Entity',
  component: Entity,
} as ComponentMeta<typeof Entity>;

const Template: ComponentStory<typeof Entity> = (props: EntityProps) => (
  <Entity {...props} />
);

export const Loading = Template.bind({});
Loading.args = {
  title: 'configuration',
  children: (
    <>
      <p className="text-white"> Hello world! </p>
    </>
  ),
};
