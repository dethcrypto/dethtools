import {
  EventFragment,
  FormatTypes,
  Interface,
  ParamType,
} from '@ethersproject/abi';
import { version } from '@ethersproject/abi/lib/_version';
import { BigNumber } from '@ethersproject/bignumber';
import { Logger } from '@ethersproject/logger';

import { combinations as generateCombinations } from '../misc/combinations';

const logger = new Logger(version);

export interface EventProps {
  topics: string[];
  data: string;
}

interface AbstractDecodedEventResult {
  eventFragment: EventFragment;
  hasArgumentNames: boolean;
  signature: string;
  fullSignature: string;
}

export interface DecodedEventResultWithArgNames
  extends AbstractDecodedEventResult {
  hasArgumentNames: true;
  args: Record<string, string | BigNumber>;
}

export interface DecodedEventResultWithoutArgNames
  extends AbstractDecodedEventResult {
  hasArgumentNames: false;
  args: ReadonlyArray<string | BigNumber>;
}

export type DecodedEventResult =
  | DecodedEventResultWithArgNames
  | DecodedEventResultWithoutArgNames;

export function decodeEvent(
  iface: Interface,
  eventProps: EventProps,
): DecodedEventResult {
  try {
    const decoded = iface.parseLog(eventProps);
    /**
     * Ethers under the hood converts EventFragment to object-like form without format function, so we rehydrate it here.
     */
    const eventFragment = EventFragment.fromObject({
      ...decoded.eventFragment,
      _isFragment: false, // Otherwise this function noops
    });
    const hasArgumentNames = doesContainNamedKeys(decoded.args);
    const decodedEventResult = {
      args: hasArgumentNames ? omitNonNamedKeys(decoded.args) : decoded.args,
      eventFragment: eventFragment,
      hasArgumentNames,
      signature: decoded.signature,
      fullSignature: eventFragment.format(FormatTypes.full),
    };
    return decodedEventResult as DecodedEventResult;
  } catch (e: any) {
    switch (e.reason) {
      case 'no matching event':
        throw e;
      case 'data out-of-bounds':
        // At this point we know that we have a matching topic, but the number of indexed args is incorrect
        return tryToDecodeEvent(iface, eventProps);
      default:
        throw e;
    }
  }
}

/**
 * We assume that we don't have partial indexing information.
 * This may not be true, but it's an edge case and it's PITA to handle.
 */
export function tryToDecodeEvent(
  iface: Interface,
  eventProps: EventProps,
): DecodedEventResult {
  const indexedArgsCount = eventProps.topics.length - 1;
  const topichash = eventProps.topics[0];

  for (const name in iface.events) {
    if (topichash === iface.getEventTopic(name)) {
      const event = iface.getEvent(name);
      const inputsCombinations = combinationsMap(
        event.inputs,
        indexedArgsCount,
        (input: ParamType): ChangedParamType => ({
          arrayChildren: input.arrayChildren,
          components: input.components,
          name: input.name,
          type: input.type,
          arrayLength: input.arrayLength,
          baseType: input.baseType,
          indexed: true,
        }),
      );

      let error: unknown;
      for (const inputs of inputsCombinations) {
        const newEvent = EventFragment.fromObject({
          inputs,
          anonymous: event.anonymous,
          type: event.type,
          name: event.name,
        });

        iface.events[name] = newEvent;

        try {
          const args = iface.decodeEventLog(
            newEvent,
            eventProps.data,
            eventProps.topics,
          );

          return {
            args,
            hasArgumentNames: false,
            eventFragment: newEvent,
            signature: newEvent.format(FormatTypes.sighash),
            fullSignature: newEvent.format(FormatTypes.full),
          };
        } catch (err) {
          error = err;
          // We expect this to fail for some combinations. It's only a problem if it fails for all combinations.
        }
      }

      if (error) {
        throw error;
      }
    }
  }

  return logger.throwArgumentError('no matching event', 'topichash', topichash);
}

// @internal
export function omitNonNamedKeys<T extends object>(
  object: T,
): Record<string, string | BigNumber> | T {
  const obj: Record<string, string | BigNumber> = {};
  for (const [key, val] of Object.entries(object)) {
    if (isNaN(parseInt(key))) {
      obj[key] = val;
    }
  }
  return obj;
}

// @internal
export function doesContainNamedKeys<T extends object>(object: T): boolean {
  return Object.keys(object).some((key) => isNaN(parseInt(key)));
}

type ChangedParamType = Omit<ParamType, 'format' | '_isParamType'>;

function combinationsMap(
  inputs: ParamType[],
  indexedArgsCount: number,
  change: (param: ParamType) => ChangedParamType,
): ChangedParamType[][] {
  const combinations = generateCombinations(inputs.length, indexedArgsCount);
  return combinations.map((combination) =>
    inputs.map((input, idx) =>
      combination.includes(idx) ? change(input) : input,
    ),
  );
}
