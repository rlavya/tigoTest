// @flow

import { database } from "../reducers/db";
import map from "lodash/map";

const ID_SEPARATOR = "--/--";

export const configToId = (
  tableName: string,
  id: string,
  isCollection: boolean
): string => {
  return [tableName, id, isCollection ? "*" : "1"].join(ID_SEPARATOR);
};

export const idToConfig = (serializedConfig: string) => {
  const [
    tableName: string,
    id: string,
    isCollection: string
  ] = serializedConfig.split(ID_SEPARATOR);
  return {
    tableName,
    id,
    isCollection: isCollection === "*" ? true : false
  };
};

const defaultProcessor = (item, state): Object => {
  return {
    ...item.value,
    id: item.id
  };
};

export const dataForId = (
  state: Object,
  serializedId: string,
  processor: Function = defaultProcessor
) => {
  const dbTables = database.selectTables(state.db);
  const MetaTable = dbTables.Meta;
  const meta = MetaTable.getOrDefault(serializedId);

  if (meta) {
    const Table = dbTables[meta.value.tableName];
    const data = map(meta.value.entityIds, id => {
      const datum = Table.getOrDefault(id);
      if (!datum) {
        return null;
      }
      return processor(datum, state);
    });

    return {
      state: meta.value.state,
      data: meta.value.isCollection ? data : data[0]
    };
  } else {
    return {};
  }
};
