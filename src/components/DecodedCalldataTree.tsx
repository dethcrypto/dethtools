import { ParamType } from '@ethersproject/abi';
import { ReactElement } from 'react';

import { Decoded } from '../lib/decodeCalldata';
import { NodeBlock } from './lib/NodeBlock/NodeBlock';

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
      value: decoded[index] ? String(decoded[index]) : '',
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
}): ReactElement {
  if ('value' in node) {
    return (
      <span className={className}>
        <div>
          {node.type.match(isNodeArray) ? (
            <div className="my-4 overflow-auto rounded-md border border-gray-600 p-3 text-sm">
              <p
                aria-label="node type"
                id="node-type"
                className="pt-1 text-purple"
              >
                {node.name ? (
                  <code className="text-pink">{node.name} </code>
                ) : (
                  ' '
                )}
                {node.type}
              </p>

              <section className="flex flex-wrap">
                {node.value?.split(',').map((str, i) => {
                  return (
                    <NodeBlock className="basis shrink grow" str={str} key={i}>
                      <code className="text-gray-600">[{i}] </code>
                    </NodeBlock>
                  );
                })}
              </section>
            </div>
          ) : node.value ? (
            <NodeBlock className="my-2" str={node.value} nodeType={node.type}>
              {node.name ? <code className="text-pink">{node.name}</code> : ' '}
            </NodeBlock>
          ) : (
            <code aria-label="node type" id="node-type" className="text-purple">
              {node.type}
            </code>
          )}
        </div>
      </span>
    );
  }

  return (
    <section>
      <code className="text-purple">struct</code> {node.name}
      {':'}
      <ul className="pb-1">
        {node.components.map((node, index) => (
          <div key={index} className="border-l border-gray-600 pl-3">
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
}): ReactElement {
  const tree = attachValues(inputs, decoded);
  return (
    <output className="mb-2 overflow-auto">
      <pre className="bg-gray-900">
        <p className="mb-2">
          <code aria-label="function type" className="font-bold text-purple">
            {fnType}
          </code>
          <code aria-label="function name"> {fnName} </code>
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
