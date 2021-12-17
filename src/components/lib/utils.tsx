import { message } from "@osui/ui";
import axios from "axios";
// @ts-ignore
import { IQL_CONDITION } from 'proxima-sdk/lib/Global';

export const getChartsData = async (props: { option: any; tenant: any; sessionToken: any; workspace:any }) => {
  const { option, tenant, sessionToken, workspace } = props;
  const { group, value, type, iql = '', cluster } = option;
  const nomalIql = `所属空间 ${IQL_CONDITION.EQUAL} '${workspace?.name}'`;
  const Iql = iql === '' ? nomalIql : nomalIql && iql;
  try {
    if (!value?.length || !group?.length) {
      return null;
    }
    const resData = await axios.post(
      `${globalThis.env.PROXIMA_GATEWAY}/parse/api/report/${tenant.key}/${type}/search`,
      {
        group,
        value,
        iql: Iql,
        workspace: '',
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
