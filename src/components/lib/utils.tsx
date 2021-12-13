import { message } from "@osui/ui";
import axios from "axios";

export const getChartsData = async (props: { option: any; tenant: any }) => {
    const { option, tenant } = props;
    const { group, value, type, iql, cluster } = option;
    try {
      const resData = await axios.post(`/report/${tenant.key}/${type}/search`, {
        group,
        value,
        iql,
        workspacd: '',
        cluster,
      });
      return resData;
    } catch (error) {
      message.error(error);
    }
  };