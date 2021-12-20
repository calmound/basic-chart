// @ts-nocheck
import useSWR from 'swr';


import fetch from 'proxima-sdk/lib/Fetch';
import { IQL_CONDITION } from 'proxima-sdk/lib/Global';
import { Tenant, Workspace } from 'proxima-sdk/schema/types/models';

import { message } from '@osui/ui';
import { OptionValue } from './type';

export const useChartQuery = (tenant: Tenant, workspace: Workspace, sessionToken: string, option: OptionValue): any => {
  const { group, value, type, iql = '', cluster } = option;

  const url = `${globalThis.env.PROXIMA_GATEWAY}/parse/api/report/${tenant.key}/${type}/search`;

  const workspaceIql = `所属空间 ${IQL_CONDITION.EQUAL} '${workspace?.name}'`;
  const Iql = iql === '' ? workspaceIql : workspaceIql && iql;

  const { data, mutate } = useSWR(
    [url, group, value, type, iql, cluster, sessionToken],
    async () => {
      try {
        if (!value?.length || !group?.length || !sessionToken) {
          return null;
        }
        const data = await fetch.$post(
          url,
          {
            group,
            value,
            iql: Iql,
            cluster,
          },
          {
            headers: {
              'X-Parse-Session-Token': sessionToken,
              'X-Parse-Application-Id': globalThis.env.PROXIMA_APP_ID,
            },
          },
        );
        return data;
      } catch (error) {
        message.error(error.message);
      }
    },
  );

  return { data, isNoData: !(data && (data?.payload?.value?.length || data?.payload?.data?.length)) };
};
