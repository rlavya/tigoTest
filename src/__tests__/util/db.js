import { idToConfig, configToId } from "../../util/db";

it("will correctly serialize the config", () => {
  expect(configToId("Transactions", "list", true)).toEqual(
    "Transactions--/--list--/--*"
  );
  expect(configToId("Transactions-", "-list-", true)).toEqual(
    "Transactions---/---list---/--*"
  );
  expect(configToId("Transactions", "current", false)).toEqual(
    "Transactions--/--current--/--1"
  );
  expect(configToId("Transactions-", "-current-", false)).toEqual(
    "Transactions---/---current---/--1"
  );
});

it("will correctly deserialize the id", () => {
  expect(idToConfig("Transactions--/--list--/--*")).toEqual({
    tableName: "Transactions",
    id: "list",
    isCollection: true
  });

  expect(idToConfig("Transactions---/---list---/--*")).toEqual({
    tableName: "Transactions-",
    id: "-list-",
    isCollection: true
  });

  expect(idToConfig("Transactions--/--current--/--1")).toEqual({
    tableName: "Transactions",
    id: "current",
    isCollection: false
  });

  expect(idToConfig("Transactions---/---current---/--1")).toEqual({
    tableName: "Transactions-",
    id: "-current-",
    isCollection: false
  });
});
