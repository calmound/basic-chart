import { message } from "@osui/ui";
import axios from "axios";

export const getChartsData = async (props: { option: any; tenant: any; sessionToken: any }) => {
  const { option, tenant, sessionToken } = props;
  const { group, value, type, iql = '', cluster } = option;
  try {
    if (!value?.length || !group?.length) {
      return null;
    }
    const resData = await axios.post(
      `${globalThis.env.PROXIMA_GATEWAY}/parse/api/report/${tenant.key}/${type}/search`,
      {
        group,
        value,
        iql,
        workspacd: '',
        cluster,
      },
      {
        headers: {
          'X-Parse-Session-Token': sessionToken,
          'X-Parse-Application-Id': globalThis.env.PROXIMA_APP_ID,
        },
      },
    );
    return resData;
  } catch (error) {
    message.error(error.message);
  }
};
