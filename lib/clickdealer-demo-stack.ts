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
    const vehicleLambda = new Lambda(this, "vehicle-api");
    const health = new Lambda(this, "health");
    //Database
    new Dynamo(this);

    api.addIntegration("POST", "/vehicle", vehicleLambda);
    api.addIntegration("GET", "/health", health);
    api.addIntegration("GET", "/vehicle", vehicleLambda);
    api.addIntegration("GET", "/vehicle/{id}", vehicleLambda);
    api.addIntegration("PATCH", "/vehicle/{id}", vehicleLambda);
    api.addIntegration("DELETE", "/vehicle/{id}", vehicleLambda);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'ClickdealerDemoQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
