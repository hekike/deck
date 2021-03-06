'use strict';

import Spinner from 'spin.js';
let angular = require('angular');

import {AUTHENTICATION} from './authentication/authentication.module';
import {API_SERVICE} from './api/api.service';
import {CLOUD_PROVIDER_LOGO} from './cloudProvider/cloudProviderLogo.component';
import {HELP_FIELD_COMPONENT} from './help/helpField.component';
import {STATE_CONFIG_PROVIDER} from './navigation/state.provider';
import {APPLICATIONS_STATE_PROVIDER} from './application/applications.state.provider';
import {INFRASTRUCTURE_STATES} from './search/infrastructure/infrastructure.states';
import {VERSION_CHECK_SERVICE} from './config/versionCheck.service';
import {CORE_WIDGETS_MODULE} from './widgets';
import {TRAVIS_STAGE_MODULE} from './pipeline/config/stages/travis/travisStage.module';
import {SETTINGS} from 'core/config/settings';

require('../../../fonts/spinnaker/icons.css');

require('Select2');
require('jquery-ui');
// Must come after jquery-ui - we want the bootstrap tooltip, JavaScript is fun
require('bootstrap/dist/js/bootstrap.js');
require('bootstrap/dist/css/bootstrap.css');
require('select2-bootstrap-css/select2-bootstrap.css');
require('Select2/select2.css');
require('ui-select/dist/select.css');

require('source-sans-pro');

require('font-awesome/css/font-awesome.css');

// load all templates into the $templateCache
var templates = require.context('./', true, /\.html$/);
templates.keys().forEach(function(key) {
  templates(key);
});

module.exports = angular
  .module('spinnaker.core', [
    require('angular-messages'),
    require('angular-sanitize'),
    require('angular-ui-router'),
    require('angular-ui-bootstrap'),
    require('exports-loader?"angular.filter"!angular-filter'),
    require('exports-loader?"ui.select"!ui-select'),
    require('imports-loader?define=>false!exports-loader?"angularSpinner"!angular-spinner'),

    require('./projects/projects.module.js'),

    require('./application/application.module.js'),

    require('./account/accountLabelColor.directive.js'),
    require('./analytics/analytics.service'),
    AUTHENTICATION,
    require('./bootstrap/applicationBootstrap.directive.js'),

    API_SERVICE,

    require('./cache/caches.module.js'),
    CLOUD_PROVIDER_LOGO,
    require('./cloudProvider/cloudProviderLabel.directive.js'),
    require('./cloudProvider/serviceDelegate.service.js'),
    require('./cluster/cluster.module.js'),
    VERSION_CHECK_SERVICE,

    require('./delivery/delivery.module.js'),
    require('./deploymentStrategy/deploymentStrategy.module.js'),
    require('./deploymentStrategy/strategies/highlander/highlander.strategy.module.js'),
    require('./deploymentStrategy/strategies/none/none.strategy.module.js'),
    require('./deploymentStrategy/strategies/redblack/redblack.strategy.module.js'),
    require('./deploymentStrategy/strategies/custom/custom.strategy.module.js'),
    require('./deploymentStrategy/strategies/rollingPush/rollingPush.strategy.module.js'),

    require('./forms/forms.module.js'),

    require('./healthCounts/healthCounts.directive.js'),
    HELP_FIELD_COMPONENT,

    require('./insight/insight.module.js'),
    require('./instance/instance.module.js'),

    require('./loadBalancer/loadBalancer.module.js'),

    require('./modal/modal.module.js'),

    STATE_CONFIG_PROVIDER,
    APPLICATIONS_STATE_PROVIDER,
    INFRASTRUCTURE_STATES,
    require('./notification/notifications.module.js'),
    require('./notification/types/email/email.notification.type.module.js'),
    require('./notification/types/hipchat/hipchat.notification.type.module.js'),
    require('./notification/types/slack/slack.notification.type.module.js'),
    require('./notification/types/sms/sms.notification.type.module.js'),

    require('./pageTitle/pageTitle.service.js'),

    require('./pipeline/pipelines.module.js'),
    require('./pipeline/config/stages/bake/bakeStage.module.js'),
    require('./pipeline/config/stages/checkPreconditions/checkPreconditionsStage.module.js'),
    require('./pipeline/config/stages/cloneServerGroup/cloneServerGroupStage.module.js'),
    require('./pipeline/config/stages/core/stage.core.module.js'),
    require('./pipeline/config/stages/deploy/deployStage.module.js'),
    require('./pipeline/config/stages/destroyAsg/destroyAsgStage.module.js'),
    require('./pipeline/config/stages/disableAsg/disableAsgStage.module.js'),
    require('./pipeline/config/stages/disableCluster/disableClusterStage.module.js'),
    require('./pipeline/config/stages/enableAsg/enableAsgStage.module.js'),
    require('./pipeline/config/stages/executionWindows/executionWindowsStage.module.js'),
    require('./pipeline/config/stages/findAmi/findAmiStage.module.js'),
    require('./pipeline/config/stages/findImageFromTags/findImageFromTagsStage.module.js'),
    require('./pipeline/config/stages/jenkins/jenkinsStage.module.js'),
    TRAVIS_STAGE_MODULE,
    require('./pipeline/config/stages/manualJudgment/manualJudgmentStage.module.js'),
    require('./pipeline/config/stages/tagImage/tagImageStage.module.js'),
    require('./pipeline/config/stages/pipeline/pipelineStage.module.js'),
    require('./pipeline/config/stages/resizeAsg/resizeAsgStage.module.js'),
    require('./pipeline/config/stages/runJob/runJobStage.module.js'),
    require('./pipeline/config/stages/scaleDownCluster/scaleDownClusterStage.module.js'),
    require('./pipeline/config/stages/script/scriptStage.module.js'),
    require('./pipeline/config/stages/shrinkCluster/shrinkClusterStage.module.js'),
    require('./pipeline/config/stages/wait/waitStage.module.js'),
    require('./pipeline/config/stages/waitForParentTasks/waitForParentTasks.js'),
    require('./pipeline/config/stages/createLoadBalancer/createLoadBalancerStage.module.js'),
    require('./pipeline/config/stages/applySourceServerGroupCapacity/applySourceServerGroupCapacityStage.module.js'),
    require('./pipeline/config/preconditions/preconditions.module.js'),
    require('./pipeline/config/preconditions/types/clusterSize/clusterSize.precondition.type.module.js'),
    require('./pipeline/config/preconditions/types/expression/expression.precondition.type.module.js'),
    require('./presentation/presentation.module.js'),

    require('./search/search.module.js'),
    require('./securityGroup/securityGroup.module.js'),
    require('./serverGroup/serverGroup.module.js'),

    require('./task/task.module.js'),

    require('./utils/utils.module.js'),

    CORE_WIDGETS_MODULE,
    require('./validation/validation.module.js'),
  ])
  .run(function($rootScope, $log, $state) {
    window.Spinner = Spinner;

    $rootScope.feature = SETTINGS.feature;

    $rootScope.$state = $state; // TODO: Do we really need this?

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      $log.debug(event.name, {
        event: event,
        toState: toState,
        toParams: toParams,
        fromState: fromState,
        fromParams: fromParams
      });
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      $log.debug(event.name, {
        event: event,
        toState: toState,
        toParams: toParams,
        fromState: fromState,
        fromParams: fromParams,
        error: error
      });
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $log.debug(event.name, {
        event: event,
        toState: toState,
        toParams: toParams,
        fromState: fromState,
        fromParams: fromParams
      });
    });
  })
  .run(function (cacheInitializer) {
    cacheInitializer.initialize();
  })
  .config(function ($logProvider) {
    $logProvider.debugEnabled(SETTINGS.debugEnabled);
  })
  .config(function($uibTooltipProvider) {
    $uibTooltipProvider.options({
      appendToBody: true
    });
    $uibTooltipProvider.setTriggers({
      'mouseenter focus': 'mouseleave blur'
    });
  })
  .config(function($uibModalProvider) {
    $uibModalProvider.options.backdrop = 'static';
    $uibModalProvider.options.keyboard = false;
  })
  .config(function($httpProvider) {
    $httpProvider.defaults.headers.patch = {
      'Content-Type': 'application/json;charset=utf-8'
    };
  })
  .config(function($qProvider) {
    // Angular 1.6 stops suppressing unhandle rejections on promises. This resets it back to 1.5 behavior.
    // See https://docs.angularjs.org/guide/migration#migrate1.5to1.6-ng-services-$q
    $qProvider.errorOnUnhandledRejections(false);
  })
  .config(function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|hipchat|slack):/);
    // Angular 1.6 defaults preAssignBindingsEnabled to false, reset to true to mimic 1.5 behavior.
    // See https://docs.angularjs.org/guide/migration#migrate1.5to1.6-ng-services-$compile
    $compileProvider.preAssignBindingsEnabled(true);
  })
  .config(function($locationProvider) {
    // Angular 1.6 sets default hashPrefix to '!', change it back to ''
    // See https://docs.angularjs.org/guide/migration#migrate1.5to1.6-ng-services-$location
    $locationProvider.hashPrefix('');
  })
  .config(require('./forms/uiSelect.decorator.js'))
  .config(function(uiSelectConfig) {
    uiSelectConfig.theme = 'select2';
    uiSelectConfig.appendToBody = true;
  });
