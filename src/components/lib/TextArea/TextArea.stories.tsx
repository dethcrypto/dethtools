import { ComponentMeta, ComponentStory } from '@storybook/react';
import { noop } from 'lodash';
import React, { ReactElement, useState } from 'react';

import {
  fetch4BytesBy,
  sigHashFromCalldata,
} from '../../../../src/lib/decodeBySigHash';
import { handleChangeValidated } from '../../../../src/misc/handleChangeValidated';
import { WithError } from '../../../../src/misc/types';
import { hexValidator } from '../../../../src/misc/validation/validators/hexValidator';
import { TextArea, TextAreaProps } from './TextArea';

export default {
  title: 'lib/TextArea',
  component: TextArea,
} as ComponentMeta<typeof TextArea>;

const Template: ComponentStory<typeof TextArea> = (props: TextAreaProps) => (
  <TextArea {...props} />
);

export const Default = Template.bind({});

Default.args = {
  name: 'calldata',
  value: '0x23b8',
  error: 'Invalid calldata',
};

export const Playground = (): ReactElement => {
  const [encodedCalldata, setEncodedCalldata] = useState<WithError<string>>({
    value: '',
  });

  const handleChangeEncodedCalldata = (newValue: string): void =>
    handleChangeValidated({
      newValue,
      validateFn: (newValue) => hexValidator(newValue),
      setState: setEncodedCalldata,
      flushFn: noop,
    });

  return (
    <TextArea
      name="calldata"
      error={encodedCalldata.error}
      value={encodedCalldata.value}
      placeholder="e.g 0x23b8..3b2"
      onChange={({ target }) => handleChangeEncodedCalldata(target.value)}
      onPaste={async ({ clipboardData }) => {
        const encodedCalldata = clipboardData.getData('Text');
        const sigHash = sigHashFromCalldata(encodedCalldata);
        if (sigHash) await fetch4BytesBy.Signatures(sigHash);
      }}
    />
  );
};
