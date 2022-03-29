import { ParamType } from '@ethersproject/abi';

import { Decoded } from '../lib/decodeCalldata';
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
      value: String(decoded[index]),
    };
  });
}

function CalldataTreeNode({ node }: { node: TreeNode }) {
  if ('value' in node) {
    return (
      <span>
        <code>
          {node.name ? (
            <strong className="text-yellow-600">{node.name}</strong>
          ) : (
            <strong className="text-green-600">unknown</strong>
          )}
        </code>
        <code>
          <strong id="node-type" className=" text-purple-600">
            {' '}
            {node.type}{' '}
          </strong>
          <code id="node-value">{node.value}</code>
        </code>
      </span>
    );
  }

  return (
    <section>
      <strong> {node.name} </strong>
      <ul className="pb-1 pt-2">
        {node.components.map((node, index) => (
          <li key={index} className="border-l pl-6">
            <CalldataTreeNode node={node} />
          </li>
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
    <output className="mb-6">
      <pre>
        <section>
          <code className="font-bold text-purple-600">{fnType}</code>{' '}
          <code>{fnName}</code>
        </section>
        {tree.map((node, index) => (
          <div data-testid={index} key={index}>
            <CalldataTreeNode node={node} />
          </div>
        ))}
      </pre>
    </output>
  );
}
