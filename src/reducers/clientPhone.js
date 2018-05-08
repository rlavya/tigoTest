import { CLEAR_CURRENT_USER_ACTION } from "../actionCreators/selling";
import { isPhoneNumberValid, cleanPhoneNumber } from "../util";

const processUpdatePayload = ({ phoneNumber }) => {
  let isValid = isPhoneNumberValid(cleanPhoneNumber(phoneNumber));
  return {
    phoneNumber: cleanPhoneNumber(phoneNumber),
    isValid
  };
};

export default function(
  state = { isValid: false /*phoneNumber: "53185402"*/ }, //TODO: Remove before production
  action
) {
  switch (action.type) {
    case "clientPhone/UPDATE":
      return processUpdatePayload(action.payload);
    case CLEAR_CURRENT_USER_ACTION:
      return {};
    default:
      return state;
  }
}
