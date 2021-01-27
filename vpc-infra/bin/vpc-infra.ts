#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { VpcInfraStack } from '../lib/vpc-infra-stack';

const app = new cdk.App();
new VpcInfraStack(app, 'VpcInfraStack');
