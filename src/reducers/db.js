import * as ReduxDB from "redux-db";
import { idToConfig } from "../util/db";
import isArray from "lodash/isArray";
import map from "lodash/map";
import schema from "../schema";

export const database = ReduxDB.createDatabase(schema);

const getEntityIds = (data, Table) => {
  if (!data) {
    return [];
  }
  return map(isArray(data) ? data : [data], datum => {
    return Table.schema.getPrimaryKey(datum);
  });
};

const getCurrentMetaData = (serializedId, MetaTable) => {
  const current = MetaTable.getOrDefault(serializedId);
  return current || { value: {} };
};

const updateForId = (session, action) => {
  const serializedId = action.payload.id;
  const { tableName, id, isCollection } = idToConfig(serializedId);
  const Table = session[tableName];
  const MetaTable = session.Meta;
  const data = action.payload.data;
  const currentMetaData = getCurrentMetaData(serializedId, MetaTable).value;
  const entityIds = data
    ? getEntityIds(data, Table)
    : currentMetaData.entityIds;

  MetaTable.upsert({
    serializedId,
    tableName,
    id,
    isCollection,
    entityIds,
    state: action.payload.state,
    error: action.payload.error
  });

  if (data) {
    Table.upsert(data);
  }
};

export default database.combineReducers((session, action) => {
  // eslint-disable-next-line
  switch (action.type) {
    case "DB_UPDATE_FOR_ID":
      updateForId(session, action);
  }
});
