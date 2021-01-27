import * as cdk from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');


export class VpcInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const vpc = new ec2.Vpc(this, 'ashacdk', {
      cidr: '192.168.0.0/16',
      maxAzs: 2,

      subnetConfiguration: [
        {
          name: 'Asha_Public_Subnet',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24
        },

        {
          name: 'Asha_Private_Subnet',
          subnetType: ec2.SubnetType.PRIVATE,
          cidrMask: 24
        }
      ]

   });


   // create security group 

   const mySG = new ec2.SecurityGroup(this, 'security-group', {
      vpc: vpc,
    allowAllOutbound: true,
    securityGroupName: 'Sgbyasha-cdk'
});
   

mySG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'SSH frm anywhere');
mySG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'allow for http');
     
    
  }
}
