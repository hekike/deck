import {cloneDeep, groupBy, map, partition} from 'lodash';
import {module} from 'angular';

import {GCE_HTTP_LOAD_BALANCER_UTILS, GceHttpLoadBalancerUtils} from 'google/loadBalancer/httpLoadBalancerUtils.service';
import {IGceLoadBalancer, IGceHttpLoadBalancer} from 'google/domain/loadBalancer';

export class GceLoadBalancerSetTransformer {

  private static normalizeHttpLoadBalancerGroup(group: IGceHttpLoadBalancer[]): IGceHttpLoadBalancer {
    let normalized = cloneDeep(group[0]);

    normalized.listeners = group.map((loadBalancer) => {
      let port = loadBalancer.portRange ? GceLoadBalancerSetTransformer.parsePortRange(loadBalancer.portRange) : null;
      return {
        port,
        name: loadBalancer.name,
        certificate: loadBalancer.certificate,
      };
    });

    normalized.name = normalized.urlMapName;
    return normalized;
  }

  private static parsePortRange (portRange: string): string {
    return portRange.split('-')[0];
  }

  static get $inject() {
    return ['gceHttpLoadBalancerUtils'];
  }

  constructor(private gceHttpLoadBalancerUtils: GceHttpLoadBalancerUtils) {}

  public normalizeLoadBalancerSet = (loadBalancers: IGceLoadBalancer[]): IGceLoadBalancer[] => {
    let [httpLoadBalancers, otherLoadBalancers] = partition(loadBalancers, lb => this.gceHttpLoadBalancerUtils.isHttpLoadBalancer(lb));

    let groupedByUrlMap = groupBy(httpLoadBalancers, 'urlMapName');
    let normalizedElSevenLoadBalancers = map(groupedByUrlMap, GceLoadBalancerSetTransformer.normalizeHttpLoadBalancerGroup);

    return (normalizedElSevenLoadBalancers as IGceLoadBalancer[]).concat(otherLoadBalancers);
  }
}

export const LOAD_BALANCER_SET_TRANSFORMER = 'spinnaker.gce.loadBalancer.setTransformer.service';
module(LOAD_BALANCER_SET_TRANSFORMER, [GCE_HTTP_LOAD_BALANCER_UTILS])
  .service('gceLoadBalancerSetTransformer', GceLoadBalancerSetTransformer);
