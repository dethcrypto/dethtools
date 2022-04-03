import { ParamType } from '@ethersproject/abi';
import { Listbox } from '@headlessui/react';
import { useEffect, useState } from 'react';

import { Decoded } from '../lib/decodeCalldata';
import { decodeHex, encodeHex, isHex } from '../lib/decodeHex';

interface Node {
  name: ParamType['name'];
  type: ParamType['type'];
}

interface Leaf extends Node {
  value: string;
  components?: never;
}

interface Tree extends Node {
  components: Array<Leaf | TreeNode>;
  value?: never;
}

type TreeNode = Leaf | Tree;

type FormatType = 'hex' | 'dec';

function NodeBlock({
  children,
  className,
  str,
}: {
  str: string;
  children?: any;
  className?: string;
}) {
  const formats: Array<{ id: number; name: FormatType }> = [
    { id: 1, name: 'hex' },
    { id: 2, name: 'dec' },
  ];

  const [currentFormat, setCurrentFormat] = useState(formats[0]);

  useEffect(() => {
    if (!isHex(str)) {
      setCurrentFormat(formats[1]);
    }
    // it needs to be called only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function formatNodeValue(format: FormatType, value: string) {
    if (format === 'dec') return decodeHex(value);
    else return encodeHex(value);
  }

  return (
    <div
      className={`flex cursor-pointer items-center gap-3 overflow-auto
      rounded-md border border-deth-gray-600 duration-200
      hover:bg-deth-gray-700 hover:shadow-md hover:shadow-pink/25
      hover:outline hover:outline-2
    active:bg-deth-gray-800 ${className}`}
    >
      <Listbox value={currentFormat} onChange={setCurrentFormat}>
        <Listbox.Button
          className={`ml-3 flex cursor-pointer items-center rounded-md border
                      border-deth-gray-600 px-2 duration-200 hover:bg-deth-gray-700 hover:shadow-md
                      hover:shadow-pink/25 hover:outline hover:outline-2
                      active:bg-deth-gray-800 ${className}`}
        >
          {currentFormat.name}
        </Listbox.Button>

        <Listbox.Options>
          <div className="flex items-center">
            {formats
              .filter((fmt) => fmt.id !== currentFormat.id)
              .map((fmt) => (
                <Listbox.Option
                  as="ul"
                  className={`m-0 flex cursor-pointer items-center rounded-md
                    border border-deth-gray-600 p-0
                    px-2 duration-200 hover:bg-deth-gray-700 hover:shadow-md
                  hover:shadow-pink/25 hover:outline hover:outline-2
                  active:bg-deth-gray-800 ${className}`}
                  key={fmt.id}
                  value={fmt}
                >
                  {fmt.name}
                </Listbox.Option>
              ))}
          </div>
        </Listbox.Options>
      </Listbox>

      {children}
      <b id="node-value">{formatNodeValue(currentFormat.name, str)}</b>
    </div>
  );
}

function attachValues(components: ParamType[], decoded: Decoded): TreeNode[] {
  return components.map((input, index): TreeNode => {
    if (input.type === 'tuple') {
      const value = decoded[index];

      if (!Array.isArray(value)) {
        throw new Error(
          'input.type is tuple, but decoded value is not an array',
        );
      }
      const { components } = input;
      return {
        name: input.name,
        type: input.type,
        components: attachValues(components, value),
      };
    }
    return {
      name: input.name,
      type: input.type,
      value: String(decoded[index]),
    };
  });
}

// Test if node.type contains [*] pattern,
// where * is any asterisk, and [] must
// occur, thus we know if type is an array.
const isNodeArray = new RegExp(/[[*\]]/);

function CalldataTreeNode({
  node,
  className,
}: {
  node: TreeNode;
  className?: string;
}) {
  if ('value' in node) {
    return (
      <span className={className}>
        <code>
          {node.type.match(isNodeArray) ? (
            <div className="my-4 rounded-lg border border-deth-gray-600 p-3">
              <p id="node-type" className="text-purple-400 pt-2 pb-4">
                {node.name ? (
                  <b className="text-deth-pink">{node.name} </b>
                ) : (
                  <b className="text-pink-400">unknown name </b>
                )}
                {node.type}
              </p>

              <section className="flex flex-wrap gap-2">
                {node.value?.split(',').map((str, i) => {
                  return (
                    <NodeBlock className="basis shrink grow" str={str} key={i}>
                      <code className="text-deth-gray-600">[{i}] </code>
                    </NodeBlock>
                  );
                })}
              </section>
            </div>
          ) : (
            <NodeBlock className="my-2" str={node.value ?? 'value missing'}>
              {node.name ? (
                <b className="text-pink-400">{node.name}</b>
              ) : (
                <b className="text-pink-400">unknown name</b>
              )}
              <b id="node-type" className=" text-purple-400">
                {node.type}
              </b>
            </NodeBlock>
          )}
        </code>
      </span>
    );
  }

  return (
    <section>
      <b className="text-purple-400">struct</b> {node.name}
      {':'}
      <ul className="pb-1">
        {node.components.map((node, index) => (
          <div key={index} className="border-l border-deth-gray-600 pl-3">
            <CalldataTreeNode node={node} />
          </div>
        ))}
      </ul>
    </section>
  );
}

export function DecodedCalldataTree({
  fnName,
  fnType,
  decoded,
  inputs,
}: {
  fnName?: string;
  fnType?: string;
  decoded: Decoded;
  inputs: ParamType[];
}) {
  const tree = attachValues(inputs, decoded);
  return (
    <output className="mb-2 bg-deth-error">
      <pre className="bg-deth-gray-900">
        <p>
          <code className="text-purple-400 font-bold">{fnType} </code>
          <code>{fnName} </code>
        </p>

        {tree.map((node, index) => (
          <div data-testid={index} key={index}>
            <CalldataTreeNode node={node} />
          </div>
        ))}
      </pre>
    </output>
  );
}
