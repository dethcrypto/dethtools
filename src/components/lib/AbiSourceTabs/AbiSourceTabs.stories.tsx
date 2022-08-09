import { ComponentMeta, ComponentStory } from '@storybook/react';
import { noop } from 'lodash';
import React, { ReactElement, useState } from 'react';

import { handleChangeValidated } from '../../../../src/misc/handleChangeValidated';
import { WithError } from '../../../../src/misc/types';
import { abiValidator } from '../../../../src/misc/validation/validators/abiValidator';
import { AbiSourceTabs, AbiSourceTabsProps } from './AbiSourceTabs';

export default {
  title: 'lib/AbiSourceTabs',
  component: AbiSourceTabs,
  options: {
    storySort: {
      order: ['Default'],
    },
  },
} as ComponentMeta<typeof AbiSourceTabs>;

const Template: ComponentStory<typeof AbiSourceTabs> = (
  props: AbiSourceTabsProps<any, any>,
) => <AbiSourceTabs {...props} />;

export const Default = Template.bind({});

Default.args = {
  rawAbi: { value: '' },
  setDecodeResults: noop,
  handleChangeRawAbi: noop,
  tabState: { tab: 'abi', setTab: noop },
};

export const Playground = (): ReactElement => {
  const [tab, setTab] = useState<'abi' | '4-bytes'>('4-bytes');
  const [rawAbi, setRawAbi] = useState<WithError<string>>({ value: '' });

  const handleChangeRawAbi = (newValue: string): void =>
    handleChangeValidated({
      newValue,
      validateFn: (newValue) => abiValidator(newValue),
      setState: setRawAbi,
      flushFn: noop,
    });

  return (
    <AbiSourceTabs
      rawAbi={rawAbi}
      setDecodeResults={noop}
      handleChangeRawAbi={(event) => handleChangeRawAbi(event.target.value)}
      tabState={{ tab, setTab }}
    />
  );
};
