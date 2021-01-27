#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AlbtestStack } from '../lib/albtest-stack';

const app = new cdk.App();
new AlbtestStack(app, 'AlbtestStack', {
 env:{
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 

 }


});
