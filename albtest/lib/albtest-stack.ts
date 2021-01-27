import * as cdk from '@aws-cdk/core';

import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import targets = require('@aws-cdk/aws-elasticloadbalancingv2-targets');

export class AlbtestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
  super(scope, id, props);
  
       const myvpc  = ec2.Vpc.fromLookup(this, 'ImportVPC',{isDefault: false,vpcId: 'vpc-0d5906cd5866c1aa3' });
	   const mysg =   ec2.SecurityGroup.fromSecurityGroupId(this, 'SG', 'sg-0bb5279e709ff99ef');
	   
	   const  MyPublicSubnets = myvpc.selectSubnets({
		subnets: [
		   ec2.Subnet.fromSubnetAttributes(this, 'publicsubnet-111', {
		   subnetId: 'subnet-028d7c16f1341ac1b', availabilityZone: 'ap-northeast-2a',
		    routeTableId: 'rtb-08759727f6becc608'
		 }),

		 ec2.Subnet.fromSubnetAttributes(this, 'publicsubnet-222', {
		  subnetId: 'subnet-0ff866d98e048daf3', availabilityZone: 'ap-northeast-2b',
		  routeTableId: 'rtb-0b5278babfeb4cb6c'
	  }),
   ]
  })  

  const  MyPrivateSubnets = myvpc.selectSubnets({
	subnets: [
	   ec2.Subnet.fromSubnetAttributes(this, 'privatesubnet-111', {
	   subnetId: 'subnet-04d6972e762931ae3', availabilityZone: 'ap-northeast-2a',
		routeTableId: 'rtb-059c326c95c6354d2'
	 }),

	 ec2.Subnet.fromSubnetAttributes(this, 'privatesubnet-222', {
	  subnetId: 'subnet-02e64980e5f87e3b9', availabilityZone: 'ap-northeast-2b',
	  routeTableId: 'rtb-0474f9e1ddd4b1ce7'
  }),
]
}) 

                     const mydata = ec2.UserData.forLinux();
                      mydata.addCommands(
				     "yum install httpd -y",
				 	  "systemctl start httpd", 
					   "cd /var/www/html",
					  "echo 'welcome to hu cdk project' > cdk.html"
					)

		 //create an instances 
		 
		 const MyInstance = new ec2.Instance(this, 'asha', {
			vpc:myvpc,
			vpcSubnets: MyPrivateSubnets, // Creates instance in private subnet 
			instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO), // Instance Type
			machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }), // Type of Amazon Linux Image
			securityGroup: mysg, // Security Group
			 instanceName: 'Instance-for-Alb',
			 keyName: 'ecetesting-key',
			 userData: mydata
      });



			const TestLB = new elbv2.ApplicationLoadBalancer(this, 'TestLB', {
				vpc: myvpc,
				securityGroup: mysg, 
				loadBalancerName: 'ALB-By-Cdk1',
				internetFacing: true,
				vpcSubnets: MyPublicSubnets // create alb in public subnets 
			});
         
  
	   
	   

	    
       

           //create port 80 Listener 
	 const Testlistener = TestLB.addListener('Listener1', {
  		port: 80,
	 });

			

	 //Create Target Group
 	  const TargetGroup = Testlistener.addTargets('TestGroup', {
 	  port: 80,
	  protocol: elbv2.ApplicationProtocol.HTTP,
	  targetGroupName: 'TestGroupalb1',

	 targets: [new targets.InstanceTarget(MyInstance)],
	 
     healthCheck: {
		protocol: elbv2.Protocol.HTTP,
		port: '80', 
    	  path: '/'
	}


});






    
  }
}
