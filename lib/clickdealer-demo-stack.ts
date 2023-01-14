import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiGateway } from './ApiGateway';
import { Dynamo } from './Dynamo';
import { Lambda } from './Lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ClickdealerDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Api Gateway setup
    const api = new ApiGateway(this);

    //Lambdas setup
    const createVehicle = new Lambda(this, "vehicle-api");
    //Database
    new Dynamo(this);

    api.addIntegration("POST", "/vehicle", createVehicle);
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'ClickdealerDemoQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
