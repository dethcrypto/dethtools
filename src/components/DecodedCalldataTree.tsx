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
          {node.type.match(/[[*\]]/) ? (
            <div>
              {node.name ? (
                <b className="text-deth-pink">{node.name} </b>
              ) : (
                <b className="text-pink-400">unknown name </b>
              )}

              <b id="node-type" className=" text-purple-400">
                {node.type}
              </b>

              <code>
                {' '}
                {node.value?.split(',').map((str, i) => {
                  return (
                    <div key={i}>
                      {' '}
                      <code className="text-deth-gray-600">[{i}]</code>{' '}
                      <code id="node-value">{str}</code>
                    </div>
                  );
                })}{' '}
              </code>
            </div>
          ) : (
            <div>
              {node.name ? (
                <b className="text-pink-400">{node.name} </b>
              ) : (
                <b className="text-pink-400">unknown name </b>
              )}
              <b id="node-type" className=" text-purple-400">
                {node.type}
              </b>{' '}
              <b id="node-value">{node.value}</b>
            </div>
          )}
        </code>
      </span>
    );
  }

  return (
    <section>
      <b className="text-purple-400">struct</b> {node.name}
      {':'}
      <ul className="pb-1 pt-1">
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
    <output className="mb-2 bg-red-600">
      <pre className="bg-deth-gray-900">
        <section>
          <code className="font-bold text-purple-400">{fnType} </code>
          <code>{fnName} </code>
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
